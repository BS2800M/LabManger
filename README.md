# LabManger 实验室管理系统

## 项目概述

LabManger 是一个基于 Vue.js + Electron 桌面应用和 Fastify 后端服务的实验室管理系统。该系统专门为实验室试剂管理而设计，提供完整的试剂入库、出库、库存管理、批次追踪、预警提醒等功能。

### 主要功能
- 🔐 用户认证与权限管理
- 🏢 团队/小组管理
- 🧪 试剂信息管理
- 📦 批次管理与追踪
- 📥 入库操作
- 📤 出库操作
- 📊 库存监控
- ⚠️ 预警提醒
- 🏷️ 条码打印
- 📈 操作记录追踪

## 技术架构

### 前端 (Electron + Vue.js)
- **框架**: Vue 3 + Vite
- **桌面应用**: Electron 27.x
- **构建工具**: electron-vite 4.x
- **UI组件库**: Element Plus
- **路由**: Vue Router 4
- **HTTP客户端**: Axios
- **条码生成**: jsbarcode
- **Excel处理**: xlsx

### 后端 (Fastify)
- **框架**: Fastify 5.3.3
- **数据库**: SQLite + Prisma ORM
- **认证**: JWT (jsonwebtoken)
- **日志**: Pino
- **进程管理**: PM2
- **开发工具**: TypeScript + tsx

## 项目结构

```
LabManger/
├── electron-vite/           # 前端桌面应用
│   ├── src/                 # 源码目录
│   │   ├── main/            # 主进程
│   │   │   └── index.js     # 主进程入口
│   │   ├── preload/         # 预加载脚本
│   │   │   └── index.js     # 预加载脚本入口
│   │   └── renderer/        # 渲染进程
│   │       ├── index.html   # 渲染进程入口
│   │       └── src/         # Vue 源码
│   │           ├── components/  # Vue 组件
│   │           ├── router/      # 路由配置
│   │           ├── api/         # API 接口
│   │           ├── utils/       # 工具函数
│   │           ├── assets/      # 静态资源
│   │           ├── main.js      # Vue 入口
│   │           └── App.vue      # 根组件
│   ├── electron.vite.config.cjs # electron-vite 配置
│   └── package.json         # 前端依赖配置
├── fastify/                 # 后端服务
│   ├── router/              # 路由定义
│   ├── plugin/              # 插件
│   ├── prisma/              # 数据库
│   │   ├── schema.prisma    # 数据库模型
│   │   ├── data.db          # SQLite 数据库文件
│   │   └── migrations/      # 数据库迁移
│   ├── types/               # TypeScript 类型定义
│   ├── app.ts               # 应用入口
│   └── package.json         # 后端依赖配置
├── 项目接口api.md           # API 接口文档
└── README.md                # 项目说明文档
```

## 数据库设计

### 核心数据模型

#### 1. 团队 (team)
- 实验室小组信息管理
- 包含名称、电话、备注等基本信息

#### 2. 试剂 (reagent)
- 试剂基本信息
- 规格、价格、预警数量、存储条件等

#### 3. 批次 (lot)
- 试剂批次管理
- 批号、有效期、关联试剂

#### 4. 操作记录 (operation)
- 所有入库、出库操作记录
- 包含条码号、操作时间、操作用户等

#### 5. 库存 (inventory)
- 实时库存信息
- 出库统计、库存修正等

#### 6. 用户 (user)
- 用户账户管理
- 权限控制、团队归属

## 安装与部署

### 环境要求
- Node.js 20.x 或更高版本
- npm 9.x 或更高版本
- Windows 10及以上操作系统（支持 32 位架构）

### 后端部署

1. **进入后端目录**
   ```bash
   cd fastify
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **初始化数据库**
   ```bash
   npx prisma migrate deploy
   ```



5. **启动服务**
   ```bash
   # 开发环境
   npm run dev
   
   # 生产环境
   npm run start
   ```

### 前端构建

1. **进入前端目录**
   ```bash
   cd electron-vite
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **开发模式**
   ```bash
   npm run dev
   ```

4. **构建应用**
   ```bash
   npm run build:win
   ```

5. **新建文件conf.txt到D:\vb\LabManger\electron-vite\dist\win-ia32-unpacked 内容如下**
   
   **其中baseurl 为你的服务端ip和端口**
   ```bash
   {"baseurl":"http://127.0.0.1:8000","printername":"","select_printerid":"0","allow_print":false}
   ```


## 配置说明

### 后端配置
- 默认端口: 8000
- 数据库: SQLite (prisma/data.db)

### 前端配置
- 开发环境服务器端口: 5173
- 构建输出目录: `out/`
- 配置文件: `conf.txt` (包含打印机配置、服务器地址等)
- 应用图标: `icon.ico`

## 主要功能模块

### 1. 用户认证
- 登录/登出功能
- JWT Token 认证
- 权限控制

### 2. 团队管理
- 创建、编辑、删除团队
- 团队信息维护
- 团队状态管理

### 3. 试剂管理
- 试剂信息录入
- 规格、价格、预警设置
- 存储条件配置

### 4. 批次管理
- 批次信息录入
- 有效期管理
- 批次状态跟踪

### 5. 入库操作
- 扫描条码入库
- 批次信息录入
- 库存自动更新

### 6. 出库操作
- 扫描条码出库
- 库存扣减
- 操作记录追踪

### 7. 库存监控
- 实时库存查看
- 库存预警提醒
- 库存修正功能

### 8. 条码打印
- 条码生成
- 打印机配置

详细的 API 文档请参考 `项目接口api.md` 文件。






## 常见问题

### 1. 数据库连接问题
- 检查 `.env` 文件中的数据库路径配置
- 确保 `prisma/data.db` 文件存在且有读写权限


### 3. 打印机配置
- 在 `conf.txt` 中配置正确的打印机名称
- 确保打印机驱动已正确安装

### 4. 条码扫描问题
- 检查条码格式是否正确
- 确保条码扫描器正常工作

### 5. electron-vite 相关问题
- 确保 Node.js 版本 >= 20.x
- 检查依赖版本兼容性
- 清理 node_modules 并重新安装依赖

## 更新日志

### v2.0.0 (当前版本)
- 使用 electron-vite 4.x 架构
- 升级 Electron 到 27.x
- 优化构建流程和开发体验
- 完整功能实现


