# LabManger-dev

LabManger-dev 是一个面向实验室场景的库存管理项目，包含前端管理界面、后端业务 API，以及独立的条码静默打印服务。

## 项目功能

- 试剂与批号管理（新增、编辑、停用、删除）
- 入库/出库（普通模式 + UDI 快速模式）
- 操作记录查询与批次禁用（回滚库存影响）
- 库存树形查询、库存审计、库存趋势统计
- 传感器位置与温湿度记录管理
- 小组与用户管理（角色体系）
- 条码补打（Code128）

## 仓库结构

```txt
LabManger-dev/
├─ LabMangerNest/      # NestJS + Prisma + SQLite 后端
├─ vue/                # Vue 3 + Vite 前端
├─ barcode_printer/    # Rust GUI + HTTP 条码打印服务
└─ README.md
```

## 技术栈

- 前端：Vue 3、Vite、Element Plus、Axios
- 后端：NestJS 11（Fastify）、Prisma、SQLite、Zod
- 打印服务：Rust（eframe GUI + tiny_http）

## 系统架构与端口

- 前端开发服务：`http://127.0.0.1:5173`
- 后端 API：`http://127.0.0.1:8000`
- 打印服务：`http://127.0.0.1:18080`

前端 `vite.config.js` 已配置代理：

- `/cross` -> `http://127.0.0.1:8000`
- `/barcode-printer` -> `http://127.0.0.1:18080`

因此本地开发默认无需额外处理跨域。

## 环境要求

- Node.js 20+
- npm 10+
- Rust stable（建议通过 rustup 安装）
- Windows/Linux/macOS

> Windows 下条码打印体验最佳（项目内已实现 Windows 打印机枚举与静默打印流程）。

## 快速开始

### 1) 初始化后端

```bash
cd LabMangerNest
npm install
npm run prisma:build
```

`prisma:build` 会执行：

- Prisma Client 生成（user/manger/PatientTest）
- SQLite 结构同步（`prisma db push`）

### 2) 初始化前端

```bash
cd vue
npm install
```

### 3) 初始化打印服务

```bash
cd barcode_printer
cargo build
```

## 开发启动（推荐顺序）

建议开 3 个终端分别运行：

### 1) 启动后端

```bash
cd LabMangerNest
npm run dev
```

### 2) 启动打印服务

```bash
cd barcode_printer
cargo run
```

### 3) 启动前端

```bash
cd vue
npm run dev
```

浏览器访问：`http://127.0.0.1:5173`

## 首次登录与身份说明

系统首次启动时，后端会自动初始化默认数据：

- 默认小组：`默认小组`
- 默认管理员账号：`00010`
- 默认密码：`123456`（审核者密码与检验者密码均为该值）

登录流程：

1. 在登录页先登录“审核者”
2. 进入系统后，可在右上角弹窗登录“检验者”

说明：当前前端请求鉴权头使用 `reviewerSessionId` 写入 `sessionid`，因此业务接口主要依赖审核者会话。

## 主要业务模块

- 试剂与批号：维护基础档案、预警参数、有效期
- 入库：
  - 普通入库：按试剂/批号/数量批量入库
  - 快速入库：解析 GS1 UDI 自动匹配（或创建）批号
- 出库：
  - 普通出库：按试剂/批号/数量出库
  - 快速出库：按 UDI 或条码快速出库
- 操作查询：按时间、试剂、UDI、条码检索历史批次
- 库存管理：树形库存、全量审计、统计图表
- 环境监测：位置配置、传感器记录、超时与阈值预警
- 系统管理：小组管理、用户管理

## 后端 API 概览

所有接口返回结构为统一 `success/data/meta` 风格（异常时返回错误信息）。

- 身份认证：
  - `POST /identity/auth/signin-reviewer`
  - `POST /identity/auth/signin-checker`
  - `GET /identity/auth/signout`
- 小组与用户：
  - `/identity/team/*`
  - `/identity/user/*`
- 库存业务：
  - `/stock/reagents/*`
  - `/stock/lots/*`
  - `/stock/operations/*`
  - `/stock/inventory/*`
- 环境监测：
  - `/sensorMonitor/locations/*`
  - `/sensorMonitor/sensorRecord/*`
- 其他：
  - `GET /others/time`

额外调试接口：

- `GET /schemas`：导出各模块 Zod 请求模型对应的 JSON Schema

## 条码补打服务（Rust）

启动 `barcode_printer` 后会出现 GUI，可选择默认打印机并管理监听端口。

HTTP 接口：`POST /print`

请求示例：

```bash
curl -X POST http://127.0.0.1:18080/print \
  -H "Content-Type: application/json" \
  -d "{\"data\":[{\"barcodeNumber\":\"1234567890\",\"reagentName\":\"试剂A\",\"lotName\":\"批号A\"}],\"printer\":\"\"}"
```

请求字段：

- `data`：必填数组，每项包含
  - `barcodeNumber`
  - `reagentName`
  - `lotName`
- `printer`：可选，未传时使用 GUI 里设置的默认打印机（或系统默认）

打印内容：Code128 条码 + 3 行文字（条码号、试剂名称、批号名称）。

## 数据库与定时任务

### SQLite 数据库

默认在 `LabMangerNest/prisma/` 下使用 3 个库：

- `user.db`
- `manger.db`
- `PatientTest.db`

可通过环境变量覆盖：

- `DATABASE_USER_URL`
- `DATABASE_MANGER_URL`
- `DATABASE_PATIENT_TEST_URL`

### 定时任务

- 每天 `00:01`：检查库存有效期预警
- 每 `10` 分钟：检查传感器上传超时

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

### 打印服务

```bash
cd barcode_printer
cargo run
cargo check
```

## 常见问题

### 1) 前端接口返回 401 / Unauthorized

- 确认已完成审核者登录
- 确认浏览器 `localStorage` 中存在 `reviewerSessionId`
- 确认后端服务运行在 `127.0.0.1:8000`

### 2) “补打条码”失败

- 确认 `barcode_printer` 正在运行，监听端口正确（默认 `18080`）
- 确认前端代理 `/barcode-printer` 生效
- 在 GUI 中检查默认打印机是否可用

### 3) 数据结构不同步或本地库异常

可重新执行：

```bash
cd LabMangerNest
npm run prisma:build
```

---

如果你后续调整了接口、端口或目录结构，请同步更新本 README，确保 GitHub 首页文档与代码一致。
