use std::collections::VecDeque;
use std::fs;
use std::net::{Shutdown, TcpStream};
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::mpsc::{self, Receiver, Sender};
use std::sync::{Arc, RwLock};
use std::thread::{self, JoinHandle};
use std::time::{Duration, SystemTime, UNIX_EPOCH};

use anyhow::{Context, Result, anyhow};
use barcoders::generators::image::{Color, Image, Rotation};
use barcoders::sym::code128::Code128;
use eframe::egui;
use image::{ImageBuffer, Rgba, RgbaImage};
use rusttype::{Font, Scale, point};
use serde::Deserialize;
use serde_json::json;
use tiny_http::{Header, Method, Request, Response, Server, StatusCode};

const DEFAULT_PORT: u16 = 18080;
const LOG_LIMIT: usize = 300;
const BIND_RETRY_TIMES: usize = 6;
const BIND_RETRY_DELAY_MS: u64 = 300;

#[cfg(target_os = "windows")]
const CJK_FONT_CANDIDATES: &[&str] = &[
    r"C:\Windows\Fonts\msyh.ttc",
    r"C:\Windows\Fonts\msyh.ttf",
    r"C:\Windows\Fonts\simhei.ttf",
    r"C:\Windows\Fonts\simsun.ttc",
    r"C:\Windows\Fonts\simsun.ttf",
];

#[cfg(target_os = "linux")]
const CJK_FONT_CANDIDATES: &[&str] = &[
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
    "/usr/share/fonts/truetype/arphic/ukai.ttc",
];

#[cfg(target_os = "macos")]
const CJK_FONT_CANDIDATES: &[&str] = &[
    "/System/Library/Fonts/PingFang.ttc",
    "/System/Library/Fonts/STHeiti Medium.ttc",
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
];

#[cfg(not(any(target_os = "windows", target_os = "linux", target_os = "macos")))]
const CJK_FONT_CANDIDATES: &[&str] = &[];

#[derive(Debug, Clone)]
struct RuntimeConfig {
    default_printer: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct PrintItemRequest {
    barcode_number: String,
    reagent_name: String,
    lot_name: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct PrintRequest {
    #[serde(default)]
    data: Vec<PrintItemRequest>,
    printer: Option<String>,
}

#[derive(Debug, Clone)]
struct PrintTaskItem {
    barcode_number: String,
    reagent_name: String,
    lot_name: String,
    code128_payload: String,
}

#[derive(Debug, Deserialize)]
struct WinPrinter {
    #[serde(rename = "Name")]
    name: String,
    #[serde(rename = "Default")]
    is_default: Option<bool>,
}

struct ServerHandle {
    stop_flag: Arc<AtomicBool>,
    join_handle: JoinHandle<()>,
}

struct BarcodeApp {
    runtime_config: Arc<RwLock<RuntimeConfig>>,
    log_tx: Sender<String>,
    log_rx: Receiver<String>,
    logs: VecDeque<String>,
    printers: Vec<String>,
    port_input: String,
    current_port: u16,
    server: Option<ServerHandle>,
    status_text: String,
}

impl BarcodeApp {
    fn new() -> Self {
        let (log_tx, log_rx) = mpsc::channel();

        let (printers, default_printer) = match list_printers() {
            Ok(result) => result,
            Err(err) => {
                let _ = log_tx.send(format!("[init] 获取打印机失败: {err}"));
                (Vec::new(), None)
            }
        };

        let runtime_config = Arc::new(RwLock::new(RuntimeConfig { default_printer }));

        let mut app = Self {
            runtime_config,
            log_tx,
            log_rx,
            logs: VecDeque::new(),
            printers,
            port_input: DEFAULT_PORT.to_string(),
            current_port: DEFAULT_PORT,
            server: None,
            status_text: "未启动".to_string(),
        };

        app.start_server();
        app
    }

    fn push_log(&mut self, line: impl Into<String>) {
        self.logs.push_back(line.into());
        while self.logs.len() > LOG_LIMIT {
            let _ = self.logs.pop_front();
        }
    }

    fn drain_logs(&mut self) {
        while let Ok(line) = self.log_rx.try_recv() {
            self.push_log(line);
        }
    }

    fn refresh_printers(&mut self) {
        match list_printers() {
            Ok((printers, detected_default)) => {
                self.printers = printers;
                if let Ok(mut cfg) = self.runtime_config.write() {
                    if cfg.default_printer.is_none() {
                        cfg.default_printer = detected_default;
                    }
                }
                self.push_log("[gui] 打印机列表已刷新");
            }
            Err(err) => self.push_log(format!("[gui] 刷新打印机失败: {err}")),
        }
    }

    fn set_default_printer(&mut self, printer: Option<String>) {
        if let Ok(mut cfg) = self.runtime_config.write() {
            cfg.default_printer = printer.clone();
        }
        let shown = printer.unwrap_or_else(|| "系统默认".to_string());
        self.push_log(format!("[gui] 默认打印机已设置为: {shown}"));
    }

    fn start_server(&mut self) {
        let config = Arc::clone(&self.runtime_config);
        let log_tx = self.log_tx.clone();

        match spawn_http_server_with_retry(self.current_port, config, log_tx) {
            Ok(handle) => {
                self.server = Some(handle);
                self.status_text = format!("运行中 :{}", self.current_port);
                self.push_log(format!(
                    "[server] 服务已启动: http://127.0.0.1:{}",
                    self.current_port
                ));
            }
            Err(err) => {
                self.status_text = "启动失败".to_string();
                self.push_log(format!("[server] 启动失败: {err}"));
            }
        }
    }

    fn stop_server(&mut self) {
        self.stop_server_non_blocking();
    }

    fn stop_server_non_blocking(&mut self) {
        if let Some(server) = self.server.take() {
            let port = self.current_port;
            let log_tx = self.log_tx.clone();
            server.stop_flag.store(true, Ordering::Relaxed);
            nudge_port_release(port);
            self.status_text = "停止中".to_string();
            self.push_log("[server] 正在停止服务...");

            thread::spawn(move || {
                let line = if server.join_handle.join().is_ok() {
                    format!("[server] 服务已停止，端口 {} 已释放", port)
                } else {
                    "[server] 停止时线程异常退出".to_string()
                };
                let _ = log_tx.send(line);
            });
        }
    }

    fn stop_server_blocking(&mut self) {
        if let Some(server) = self.server.take() {
            let port = self.current_port;
            server.stop_flag.store(true, Ordering::Relaxed);
            nudge_port_release(port);

            if server.join_handle.join().is_ok() {
                self.status_text = "已停止".to_string();
                self.push_log(format!("[server] 服务已停止，端口 {} 已释放", port));
            } else {
                self.status_text = "停止失败".to_string();
                self.push_log("[server] 停止时线程异常退出");
            }
        }
    }

    fn restart_server_with_port(&mut self, port: u16) {
        if self.server.is_some() && port == self.current_port {
            self.push_log("[gui] 端口未变化，服务保持运行");
            return;
        }
        self.stop_server_blocking();
        self.current_port = port;
        self.start_server();
    }

    fn selected_printer(&self) -> Option<String> {
        self.runtime_config
            .read()
            .ok()
            .and_then(|cfg| cfg.default_printer.clone())
    }
}

impl Drop for BarcodeApp {
    fn drop(&mut self) {
        self.stop_server_blocking();
    }
}

impl eframe::App for BarcodeApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        self.drain_logs();

        egui::CentralPanel::default().show(ctx, |ui| {
            ui.heading("条码静默打印服务（Rust）");

            ui.horizontal(|ui| {
                ui.label("监听端口");
                ui.text_edit_singleline(&mut self.port_input);
                if ui.button("应用并重启").clicked() {
                    match self.port_input.trim().parse::<u16>() {
                        Ok(port) if port > 0 => self.restart_server_with_port(port),
                        _ => self.push_log("[gui] 端口无效，请输入 1-65535"),
                    }
                }
            });

            ui.horizontal(|ui| {
                if ui.button("刷新打印机").clicked() {
                    self.refresh_printers();
                }

                let selected = self
                    .selected_printer()
                    .unwrap_or_else(|| "系统默认".to_string());
                let current = self.selected_printer();

                egui::ComboBox::from_label("默认打印机")
                    .selected_text(selected)
                    .show_ui(ui, |ui| {
                        if ui
                            .selectable_label(current.is_none(), "系统默认")
                            .clicked()
                        {
                            self.set_default_printer(None);
                        }

                        for printer in self.printers.clone() {
                            let is_selected = current.as_ref() == Some(&printer);
                            if ui.selectable_label(is_selected, &printer).clicked() {
                                self.set_default_printer(Some(printer));
                            }
                        }
                    });
            });

            ui.horizontal(|ui| {
                if ui.button("启动服务").clicked() && self.server.is_none() {
                    self.start_server();
                }
                if ui.button("停止服务").clicked() {
                    self.stop_server();
                }
                ui.label(format!("状态: {}", self.status_text));
            });

            ui.separator();
            ui.label("HTTP 接口: POST /print");
            ui.label("示例 JSON: {\"data\":[{\"barcodeNumber\":\"1234567890\",\"reagentName\":\"试剂A\",\"lotName\":\"批号A\"}],\"printer\":\"可选\"}");
            ui.label(format!("当前监听: 127.0.0.1:{}", self.current_port));

            ui.separator();
            ui.label("运行日志");
            egui::ScrollArea::vertical()
                .max_height(260.0)
                .show(ui, |ui| {
                    for line in &self.logs {
                        ui.label(line);
                    }
                });
        });

        ctx.request_repaint_after(Duration::from_millis(300));
    }
}

fn main() -> Result<()> {
    let native_options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default()
            .with_title("Barcode Silent Printer")
            .with_inner_size([520.0, 460.0]),
        ..Default::default()
    };

    let app = BarcodeApp::new();

    eframe::run_native(
        "Barcode Silent Printer",
        native_options,
        Box::new(move |cc| {
            setup_cjk_fonts(&cc.egui_ctx);
            Ok(Box::new(app))
        }),
    )
    .map_err(|err| anyhow!("GUI 启动失败: {err}"))
}

fn setup_cjk_fonts(ctx: &egui::Context) {
    let Some((font_name, font_data)) = load_cjk_font_data() else {
        return;
    };

    let mut fonts = egui::FontDefinitions::default();
    fonts.font_data.insert(
        font_name.clone(),
        egui::FontData::from_owned(font_data).into(),
    );

    if let Some(proportional) = fonts.families.get_mut(&egui::FontFamily::Proportional) {
        proportional.insert(0, font_name.clone());
    }

    if let Some(monospace) = fonts.families.get_mut(&egui::FontFamily::Monospace) {
        monospace.insert(0, font_name);
    }

    ctx.set_fonts(fonts);
}

fn load_cjk_font_data() -> Option<(String, Vec<u8>)> {
    for path in CJK_FONT_CANDIDATES {
        if let Ok(bytes) = fs::read(path) {
            let font_name = Path::new(path)
                .file_name()
                .map(|name| name.to_string_lossy().to_string())
                .unwrap_or_else(|| "cjk-font".to_string());
            return Some((font_name, bytes));
        }
    }

    None
}

fn spawn_http_server(
    port: u16,
    runtime_config: Arc<RwLock<RuntimeConfig>>,
    log_tx: Sender<String>,
) -> Result<ServerHandle> {
    let server = Server::http(("127.0.0.1", port))
        .map_err(|err| anyhow!("端口绑定失败 ({}): {err}", port))?;

    let stop_flag = Arc::new(AtomicBool::new(false));
    let stop_for_thread = Arc::clone(&stop_flag);

    let join_handle = thread::spawn(move || {
        while !stop_for_thread.load(Ordering::Relaxed) {
            match server.recv_timeout(Duration::from_millis(200)) {
                Ok(Some(request)) => handle_http_request(request, &runtime_config, &log_tx),
                Ok(None) => {}
                Err(err) => {
                    let _ = log_tx.send(format!("[server] 接收请求异常: {err}"));
                    thread::sleep(Duration::from_millis(150));
                }
            }
        }
    });

    Ok(ServerHandle {
        stop_flag,
        join_handle,
    })
}

fn spawn_http_server_with_retry(
    port: u16,
    runtime_config: Arc<RwLock<RuntimeConfig>>,
    log_tx: Sender<String>,
) -> Result<ServerHandle> {
    let mut last_err: Option<anyhow::Error> = None;

    for attempt in 1..=BIND_RETRY_TIMES {
        match spawn_http_server(
            port,
            Arc::clone(&runtime_config),
            log_tx.clone(),
        ) {
            Ok(handle) => return Ok(handle),
            Err(err) => {
                if is_addr_in_use_error(&err) && attempt < BIND_RETRY_TIMES {
                    let _ = log_tx.send(format!(
                        "[server] 端口 {} 暂时被占用，正在重试 ({}/{})",
                        port, attempt, BIND_RETRY_TIMES
                    ));
                    thread::sleep(Duration::from_millis(BIND_RETRY_DELAY_MS));
                    last_err = Some(err);
                    continue;
                }
                return Err(err);
            }
        }
    }

    Err(last_err.unwrap_or_else(|| anyhow!("端口绑定失败 ({})", port)))
}

fn nudge_port_release(port: u16) {
    if let Ok(stream) = TcpStream::connect(("127.0.0.1", port)) {
        let _ = stream.shutdown(Shutdown::Both);
    }
}

fn is_addr_in_use_error(err: &anyhow::Error) -> bool {
    let msg = err.to_string().to_lowercase();
    msg.contains("os error 10048") || msg.contains("address already in use")
}

fn handle_http_request(
    request: Request,
    runtime_config: &Arc<RwLock<RuntimeConfig>>,
    log_tx: &Sender<String>,
) {
    if request.method() != &Method::Post || request.url() != "/print" {
        respond_error_json(
            request,
            404,
            "NOT_FOUND",
            "only POST /print is supported",
        );
        return;
    }

    let mut request = request;

    let mut body = String::new();
    if let Err(err) = request.as_reader().read_to_string(&mut body) {
        respond_error_json(request, 400, "BAD_REQUEST", "request body read failed");
        let _ = log_tx.send(format!("[http] body 读取失败: {err}"));
        return;
    }

    let payload = match serde_json::from_str::<PrintRequest>(&body) {
        Ok(v) => v,
        Err(err) => {
            respond_error_json(request, 400, "BAD_REQUEST", "invalid json payload");
            let _ = log_tx.send(format!("[http] JSON 解析失败: {err}"));
            return;
        }
    };

    if payload.data.is_empty() {
        respond_error_json(request, 400, "BAD_REQUEST", "data can not be empty");
        return;
    }

    let mut tasks = Vec::with_capacity(payload.data.len());
    for (idx, item) in payload.data.into_iter().enumerate() {
        let barcode_number = item.barcode_number.trim().to_string();
        let reagent_name = item.reagent_name.trim().to_string();
        let lot_name = item.lot_name.trim().to_string();

        if barcode_number.is_empty() {
            respond_error_json(
                request,
                400,
                "BAD_REQUEST",
                &format!("data[{idx}].barcodeNumber can not be empty"),
            );
            return;
        }
        if reagent_name.is_empty() {
            respond_error_json(
                request,
                400,
                "BAD_REQUEST",
                &format!("data[{idx}].reagentName can not be empty"),
            );
            return;
        }
        if lot_name.is_empty() {
            respond_error_json(
                request,
                400,
                "BAD_REQUEST",
                &format!("data[{idx}].lotName can not be empty"),
            );
            return;
        }

        let code128_payload = match prepare_code128_payload(&barcode_number) {
            Ok(v) => v,
            Err(err) => {
                respond_error_json(
                    request,
                    400,
                    "BAD_REQUEST",
                    &format!("data[{idx}].barcodeNumber 校验失败: {err}"),
                );
                return;
            }
        };

        tasks.push(PrintTaskItem {
            barcode_number,
            reagent_name,
            lot_name,
            code128_payload,
        });
    }

    let request_id = current_request_id();
    let task_count = tasks.len();
    let printer = payload
        .printer
        .and_then(|p| {
            let s = p.trim().to_string();
            if s.is_empty() { None } else { Some(s) }
        })
        .or_else(|| {
            runtime_config
                .read()
                .ok()
                .and_then(|cfg| cfg.default_printer.clone())
        });

    let chosen_printer = printer.clone().unwrap_or_else(|| "系统默认".to_string());
    let _ = log_tx.send(format!(
        "[print][{}] count={} printer={}",
        request_id, task_count, chosen_printer
    ));

    let tasks_for_job = tasks;
    let task_count_for_job = task_count;
    let printer_for_job = printer;
    let log_tx_for_job = log_tx.clone();
    let request_id_for_job = request_id.clone();

    thread::spawn(move || {
        let result = (|| -> Result<()> {
            for (idx, task) in tasks_for_job.iter().enumerate() {
                let _ = log_tx_for_job.send(format!(
                    "[print][{}][{}/{}] barcodeNumber={} reagentName={} lotName={}",
                    request_id_for_job,
                    idx + 1,
                    task_count_for_job,
                    task.barcode_number,
                    task.reagent_name,
                    task.lot_name
                ));

                let barcode_file = generate_barcode_png(
                    &task.barcode_number,
                    &task.code128_payload,
                    &task.reagent_name,
                    &task.lot_name,
                )?;
                print_image_silently(&barcode_file, printer_for_job.as_deref())?;
            }
            Ok(())
        })();

        match result {
            Ok(()) => {
                let _ = log_tx_for_job.send(format!(
                    "[print][{}] 打印完成, count={}",
                    request_id_for_job,
                    task_count_for_job
                ));
            }
            Err(err) => {
                let _ = log_tx_for_job.send(format!(
                    "[print][{}] 打印失败: {}",
                    request_id_for_job, err
                ));
            }
        }
    });

    respond_success_json(
        request,
        200,
        json!({
            "status": 0,
            "message": "请求成功",
            "requestId": request_id,
            "count": task_count,
            "printer": chosen_printer
        }),
    );
}

fn current_request_id() -> String {
    match SystemTime::now().duration_since(UNIX_EPOCH) {
        Ok(duration) => duration.as_millis().to_string(),
        Err(_) => "0".to_string(),
    }
}

fn respond_success_json(
    request: Request,
    status: u16,
    data: serde_json::Value,
) {
    let body = json!({
        "success": true,
        "data": data
    })
    .to_string();

    respond_raw_json(request, status, body);
}

fn respond_error_json(
    request: Request,
    status: u16,
    code: &str,
    message: &str,
) {
    let body = json!({
        "success": false,
        "error": {
            "code": code,
            "message": message
        }
    })
    .to_string();

    respond_raw_json(request, status, body);
}

fn respond_raw_json(request: Request, status: u16, body: String) {
    let response = Response::from_string(body)
        .with_status_code(StatusCode(status))
        .with_header(
            Header::from_bytes(
                &b"Content-Type"[..],
                &b"application/json; charset=utf-8"[..],
            )
            .expect("valid header"),
        );

    let _ = request.respond(response);
}

fn generate_barcode_png(
    content: &str,
    code128_payload: &str,
    reagent_name: &str,
    lot_name: &str,
) -> Result<PathBuf> {
    let barcode = Code128::new(code128_payload)
        .map_err(|err| anyhow!("Code128 生成失败（编码参数）: {err}"))?;
    let encoded = barcode.encode();

    let generator = Image::PNG {
        height: 120,
        xdim: 2,
        rotation: Rotation::Zero,
        foreground: Color::new([0, 0, 0, 255]),
        background: Color::new([255, 255, 255, 255]),
    };

    let bytes = generator
        .generate(&encoded)
        .map_err(|err| anyhow!("条码图生成失败: {err}"))?;

    let image = compose_barcode_with_labels(&bytes, content, reagent_name, lot_name)?;

    let safe_tail = sanitize_file_part(content);
    let ts = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .context("系统时间异常")?
        .as_millis();

    let path = std::env::temp_dir().join(format!("barcode_{}_{}.png", ts, safe_tail));
    image.save(&path).context("写入条码图片失败")?;
    Ok(path)
}

fn compose_barcode_with_labels(
    barcode_png_bytes: &[u8],
    barcode_number: &str,
    reagent_name: &str,
    lot_name: &str,
) -> Result<RgbaImage> {
    let barcode_img = image::load_from_memory(barcode_png_bytes)
        .context("加载条码图片失败")?
        .to_rgba8();
    let font = load_print_font()?;

    const FONT_SIZE: f32 = 24.0;
    const TOP_PADDING: u32 = 16;
    const SIDE_PADDING: u32 = 24;
    const BOTTOM_PADDING: u32 = 18;
    const LINE_GAP: u32 = 10;

    let scale = Scale::uniform(FONT_SIZE);
    let line1 = format!("条码号: {barcode_number}");
    let line2 = format!("试剂名称: {reagent_name}");
    let line3 = format!("批号名称: {lot_name}");
    let line1_width = measure_text_width(&font, &line1, scale);
    let line2_width = measure_text_width(&font, &line2, scale);
    let line3_width = measure_text_width(&font, &line3, scale);
    let max_line_width = line1_width.max(line2_width).max(line3_width);
    let line_height = FONT_SIZE.ceil() as u32 + 8;
    let text_block_height = line_height * 3 + LINE_GAP * 2;

    let canvas_width = barcode_img
        .width()
        .max(max_line_width.saturating_add(SIDE_PADDING * 2));
    let canvas_height = TOP_PADDING + barcode_img.height() + LINE_GAP + text_block_height + BOTTOM_PADDING;
    let mut canvas = ImageBuffer::from_pixel(
        canvas_width,
        canvas_height,
        Rgba([255, 255, 255, 255]),
    );

    let barcode_x = ((canvas_width - barcode_img.width()) / 2) as i64;
    image::imageops::overlay(&mut canvas, &barcode_img, barcode_x, TOP_PADDING as i64);

    let mut baseline_y = TOP_PADDING as i32 + barcode_img.height() as i32 + LINE_GAP as i32;
    let line1_x = ((canvas_width.saturating_sub(line1_width)) / 2) as i32;
    draw_text_line(
        &mut canvas,
        &font,
        &line1,
        scale,
        line1_x,
        baseline_y,
    );

    baseline_y += line_height as i32 + LINE_GAP as i32;
    let line2_x = ((canvas_width.saturating_sub(line2_width)) / 2) as i32;
    draw_text_line(
        &mut canvas,
        &font,
        &line2,
        scale,
        line2_x,
        baseline_y,
    );

    baseline_y += line_height as i32 + LINE_GAP as i32;
    let line3_x = ((canvas_width.saturating_sub(line3_width)) / 2) as i32;
    draw_text_line(
        &mut canvas,
        &font,
        &line3,
        scale,
        line3_x,
        baseline_y,
    );

    Ok(canvas)
}

fn load_print_font() -> Result<Font<'static>> {
    for path in CJK_FONT_CANDIDATES {
        let bytes = match fs::read(path) {
            Ok(v) => v,
            Err(_) => continue,
        };
        if let Some(font) = Font::try_from_vec(bytes) {
            return Ok(font);
        }
    }

    Err(anyhow!(
        "未找到可用中文字体，无法在条码下方绘制文字，请检查系统字体安装"
    ))
}

fn draw_text_line(
    image: &mut RgbaImage,
    font: &Font<'static>,
    text: &str,
    scale: Scale,
    x: i32,
    y: i32,
) {
    let ascent = font.v_metrics(scale).ascent;
    let glyphs = font.layout(text, scale, point(x as f32, y as f32 + ascent));
    for glyph in glyphs {
        let Some(bb) = glyph.pixel_bounding_box() else {
            continue;
        };
        glyph.draw(|gx, gy, gv| {
            if gv <= 0.0 {
                return;
            }
            let px = bb.min.x + gx as i32;
            let py = bb.min.y + gy as i32;
            if px < 0 || py < 0 {
                return;
            }
            let px = px as u32;
            let py = py as u32;
            if px >= image.width() || py >= image.height() {
                return;
            }
            let alpha = (gv * 255.0).round() as u8;
            let dst = image.get_pixel(px, py).0;
            let inv = 255u16.saturating_sub(alpha as u16);
            let r = (dst[0] as u16 * inv / 255) as u8;
            let g = (dst[1] as u16 * inv / 255) as u8;
            let b = (dst[2] as u16 * inv / 255) as u8;
            image.put_pixel(px, py, Rgba([r, g, b, 255]));
        });
    }
}

fn measure_text_width(font: &Font<'static>, text: &str, scale: Scale) -> u32 {
    let ascent = font.v_metrics(scale).ascent;
    let glyphs = font.layout(text, scale, point(0.0, ascent));

    let mut min_x = i32::MAX;
    let mut max_x = i32::MIN;
    for glyph in glyphs {
        if let Some(bb) = glyph.pixel_bounding_box() {
            min_x = min_x.min(bb.min.x);
            max_x = max_x.max(bb.max.x);
        }
    }

    if min_x == i32::MAX || max_x == i32::MIN || max_x <= min_x {
        0
    } else {
        (max_x - min_x) as u32
    }
}

fn prepare_code128_payload(content: &str) -> Result<String> {
    if !content.is_ascii() {
        return Err(anyhow!(
            "Code128 当前仅支持 ASCII 文本，请先转为英文/数字后再打印"
        ));
    }

    if content.chars().any(|ch| ch.is_ascii_control()) {
        return Err(anyhow!(
            "Code128 内容含不可见控制字符，请仅使用可见字符"
        ));
    }

    // `barcoders` 需要显式提供 Code128 起始字符集，这里固定使用字符集 B。
    Ok(format!("Ɓ{}", content))
}

fn sanitize_file_part(input: &str) -> String {
    let mut out = String::with_capacity(24);
    for ch in input.chars() {
        if ch.is_ascii_alphanumeric() {
            out.push(ch);
        } else {
            out.push('_');
        }

        if out.len() >= 24 {
            break;
        }
    }

    if out.is_empty() {
        "barcode".to_string()
    } else {
        out
    }
}

#[cfg(target_os = "windows")]
fn print_image_silently(path: &Path, printer: Option<&str>) -> Result<()> {
    const SCRIPT: &str = r#"
$p = $env:BARCODE_PATH
$n = $env:BARCODE_PRINTER
if (-not (Test-Path -LiteralPath $p)) {
    throw "条码文件不存在: $p"
}

Add-Type -AssemblyName System.Drawing
$doc = New-Object System.Drawing.Printing.PrintDocument
if (-not [string]::IsNullOrWhiteSpace($n)) {
    $doc.PrinterSettings.PrinterName = $n.Trim()
}

if (-not $doc.PrinterSettings.IsValid) {
    throw "指定的打印机无效: $n"
}

$doc.PrintController = New-Object System.Drawing.Printing.StandardPrintController
$image = [System.Drawing.Image]::FromFile($p)

$doc.add_PrintPage({
    param($sender, $e)
    $bounds = $e.MarginBounds
    $imgWidth = [double]$image.Width
    $imgHeight = [double]$image.Height

    if ($imgWidth -le 0 -or $imgHeight -le 0) {
        $e.HasMorePages = $false
        return
    }

    $scale = [Math]::Min($bounds.Width / $imgWidth, $bounds.Height / $imgHeight)
    if ($scale -gt 1) { $scale = 1 }

    $w = [int]($imgWidth * $scale)
    $h = [int]($imgHeight * $scale)
    $x = $bounds.X + [int](($bounds.Width - $w) / 2)
    $y = $bounds.Y + [int](($bounds.Height - $h) / 2)
    $e.Graphics.DrawImage($image, $x, $y, $w, $h)
    $e.HasMorePages = $false
})

try {
    $doc.Print()
} finally {
    if ($image) { $image.Dispose() }
    $doc.Dispose()
}
"#;

    let mut cmd = Command::new("powershell");
    cmd.args(["-NoProfile", "-NonInteractive", "-Command", SCRIPT]);
    cmd.env("BARCODE_PATH", path.as_os_str());
    cmd.env("BARCODE_PRINTER", printer.unwrap_or(""));

    let output = cmd.output().context("调用 Windows 打印流程失败")?;
    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(anyhow!("Windows 静默打印命令失败: {stderr}"));
    }
    Ok(())
}

#[cfg(any(target_os = "linux", target_os = "macos"))]
fn print_image_silently(path: &Path, printer: Option<&str>) -> Result<()> {
    let mut cmd = Command::new("lp");
    if let Some(name) = printer {
        cmd.args(["-d", name]);
    }
    cmd.arg(path);

    let output = cmd.output().context("调用 lp 打印失败")?;
    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(anyhow!("lp 打印命令失败: {stderr}"));
    }

    Ok(())
}

#[cfg(not(any(target_os = "windows", target_os = "linux", target_os = "macos")))]
fn print_image_silently(_path: &Path, _printer: Option<&str>) -> Result<()> {
    Err(anyhow!("当前平台暂未实现静默打印"))
}

#[cfg(target_os = "windows")]
fn list_printers() -> Result<(Vec<String>, Option<String>)> {
    let script = "Get-CimInstance Win32_Printer | Select-Object Name,Default | ConvertTo-Json -Compress";
    let output = Command::new("powershell")
        .args(["-NoProfile", "-NonInteractive", "-Command", script])
        .output()
        .context("获取打印机列表失败")?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(anyhow!("PowerShell 获取打印机失败: {stderr}"));
    }

    let text = String::from_utf8_lossy(&output.stdout).trim().to_string();
    if text.is_empty() {
        return Ok((Vec::new(), None));
    }

    let value: serde_json::Value = serde_json::from_str(&text).context("解析打印机 JSON 失败")?;

    let mut printers = Vec::new();
    let mut default_printer = None;

    match value {
        serde_json::Value::Array(arr) => {
            for item in arr {
                if let Ok(p) = serde_json::from_value::<WinPrinter>(item) {
                    if p.is_default.unwrap_or(false) {
                        default_printer = Some(p.name.clone());
                    }
                    printers.push(p.name);
                }
            }
        }
        serde_json::Value::Object(_) => {
            if let Ok(p) = serde_json::from_value::<WinPrinter>(value) {
                if p.is_default.unwrap_or(false) {
                    default_printer = Some(p.name.clone());
                }
                printers.push(p.name);
            }
        }
        _ => {}
    }

    printers.sort();
    printers.dedup();

    Ok((printers, default_printer))
}

#[cfg(any(target_os = "linux", target_os = "macos"))]
fn list_printers() -> Result<(Vec<String>, Option<String>)> {
    let list_output = Command::new("lpstat")
        .arg("-p")
        .output()
        .context("执行 `lpstat -p` 失败")?;

    if !list_output.status.success() {
        let stderr = String::from_utf8_lossy(&list_output.stderr);
        return Err(anyhow!("`lpstat -p` 失败: {stderr}"));
    }

    let list_text = String::from_utf8_lossy(&list_output.stdout);
    let mut printers = Vec::new();
    for line in list_text.lines() {
        let mut parts = line.split_whitespace();
        if parts.next() == Some("printer") {
            if let Some(name) = parts.next() {
                printers.push(name.to_string());
            }
        }
    }

    let default_output = Command::new("lpstat")
        .arg("-d")
        .output()
        .context("执行 `lpstat -d` 失败")?;

    let default_printer = if default_output.status.success() {
        let txt = String::from_utf8_lossy(&default_output.stdout);
        txt.split(':').nth(1).map(|s| s.trim().to_string())
    } else {
        None
    };

    printers.sort();
    printers.dedup();

    Ok((printers, default_printer))
}

#[cfg(not(any(target_os = "windows", target_os = "linux", target_os = "macos")))]
fn list_printers() -> Result<(Vec<String>, Option<String>)> {
    Ok((Vec::new(), None))
}
