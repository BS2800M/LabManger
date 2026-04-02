# LabManger（当前版本）

本仓库当前是一个多项目工作区，包含：

1. `LabMangerNest`：NestJS + Prisma + SQLite 后端
2. `vue`：Vue 3 + Vite 前端
3. `barcode_printer`：Rust 桌面打印服务（GUI + HTTP）

旧版 README 中的 Electron 架构说明已不再适用。

## 当前目录结构

```txt
LabManger-dev/
├─ LabMangerNest/        # 后端（端口 8000）
├─ vue/                  # 前端（开发端口 5173）
├─ barcode_printer/      # Rust 条码打印服务（默认 127.0.0.1:18080）
└─ README.md
```

## 技术栈

- 后端：NestJS 11、Fastify、Prisma 7、SQLite、Zod
- 前端：Vue 3、Vite 7、Element Plus、Axios
- 打印：Rust（eframe GUI + tiny_http）

## 端口与通信关系

- 前端开发服务：`http://127.0.0.1:5173`
- 后端服务：`http://127.0.0.1:8000`
- Rust 打印服务：`http://127.0.0.1:18080`

前端 `vite.config.js` 已配置代理：

- `/cross` -> `http://127.0.0.1:8000`
- `/barcode-printer` -> `http://127.0.0.1:18080`

因此开发时前端通常无需关心跨域。

## 一次性初始化

### 1) 后端初始化

```bash
cd LabMangerNest
npm install
npm run prisma:build
```

`prisma:build` 会：

- 生成 Prisma Client（user/manger/PatientTest）
- 通过 `prisma db push` 同步 SQLite 结构

### 2) 前端初始化

```bash
cd vue
npm install
```

### 3) Rust 打印服务初始化

```bash
cd barcode_printer
cargo build
```

## 开发启动顺序（推荐）

### 1) 启动后端

```bash
cd LabMangerNest
npm run dev
```

后端监听 `0.0.0.0:8000`。

### 2) 启动 Rust 打印服务

```bash
cd barcode_printer
cargo run
```

默认监听 `127.0.0.1:18080`，可在 GUI 中修改端口和默认打印机。

### 3) 启动前端

```bash
cd vue
npm run dev
```

访问 Vite 输出的地址（默认 `http://127.0.0.1:5173`）。

## 前端环境变量（可选）

前端支持以下可选变量：

- `VITE_API_BASE_URL`（默认 `/cross`）
- `VITE_BARCODE_PRINTER_BASE_URL`（默认 `/barcode-printer`）

不配置时走 Vite 代理即可。

## 条码补打（Rust HTTP 接口）

接口：`POST /print`

示例：

```bash
curl -X POST http://127.0.0.1:18080/print \
  -H "Content-Type: application/json" \
  -d "{\"data\":[{\"barcodeNumber\":\"1234567890\",\"reagentName\":\"试剂A\",\"lotName\":\"批号A\"}]}"
```

请求字段：

- `data`：必填数组，每项为：
  - `barcodeNumber`
  - `reagentName`
  - `lotName`
- `printer`：可选，不传时使用 GUI 默认打印机

当前打印内容：

- 条码图（Code128）
- 条码正下方三行居中文字：条码号、试剂名称、批号名称

前端“补打条码”按钮已接此接口（`vue/src/api/barcodePrinter.js`）。

## 后端主要 API 前缀（当前）

- 身份：`/identity/auth/*`、`/identity/team/*`、`/identity/user/*`
- 库存业务：
  - 试剂：`/stock/reagents/*`
  - 批号：`/stock/lots/*`
  - 操作：`/stock/operations/*`
  - 库存：`/stock/inventory/*`
- 其他：
  - 传感器：`/sensorMonitor/sensorRecord/*`
  - 时间：`/others/time`

## 数据库说明（当前策略）

- 数据库文件位于 `LabMangerNest/prisma/*.db`
- 当前以 `prisma db push` 为主，不依赖迁移历史回放
- 如需清空并重建，可按对应 schema 执行 `--force-reset`（会清数据）

示例（管理库）：

```bash
cd LabMangerNest
npx prisma db push --schema prisma/manger/schema.prisma --url "file:./prisma/manger.db" --force-reset
```

## 常用命令速查

### 后端

```bash
cd LabMangerNest
npm run dev
npm run build
npm run prod
```

### 前端

```bash
cd vue
npm run dev
npm run build
npm run preview
```

### Rust 打印服务

```bash
cd barcode_printer
cargo run
cargo check
```

## 常见问题

### 1) 前端点“补打条码”失败

- 检查 Rust 服务是否运行在 `127.0.0.1:18080`
- 检查前端代理是否生效（`vite.config.js` 的 `/barcode-printer`）
- 检查打印机是否可用（Rust GUI 中默认打印机）

### 2) 后端启动后接口 401

- 前端请求头使用 `sessionid`
- 需要先登录并确保 `localStorage.reviewerSessionId` 有效

### 3) 数据结构不一致

执行：

```bash
cd LabMangerNest
npm run prisma:build
```

---

如果你后续继续改了接口或目录，建议同步更新本 README，避免再次出现“文档与代码不一致”。
