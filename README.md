# LabManger 实验室管理系统

## 项目概述

LabManger 是一个基于 Vue.js + Electron 桌面应用和 ASP.NET Core 9.0 后端服务的实验室管理系统。该系统专门为实验室试剂管理而设计，提供完整的试剂入库、出库、库存管理、批次追踪、预警提醒等功能。

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

### 后端 (ASP.NET Core 9.0)
- **框架**: ASP.NET Core 9.0
- **数据库**: SQLite + SqlSugar ORM
- **认证**: JWT Bearer Token
- **API文档**: OpenAPI (Swagger)
- **依赖注入**: 内置DI容器
- **全局异常处理**: 自定义异常过滤器
- **开发工具**: C# + .NET 9.0 SDK

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
├── LabMangerAPI/            # 后端服务 (ASP.NET Core)
│   ├── Controllers/         # API控制器
│   ├── Service/             # 业务逻辑层
│   ├── Repository/          # 数据访问层
│   ├── Models/              # 实体模型
│   ├── DTOs/                # 数据传输对象
│   │   └── Common/          # 通用基类
│   ├── Data/                # 数据库相关
│   ├── Validator/           # 验证器
│   ├── appsettings.json     # 配置文件
│   └── Program.cs           # 应用入口
├── old_fastify/             # 旧版Fastify后端（已废弃）
├── 项目接口api.md           # API 接口文档
└── README.md                # 项目说明文档
```

## 数据库设计

### 核心数据模型

#### 1. 团队 (Team)
- 实验室小组信息管理
- 包含名称、电话、备注等基本信息

#### 2. 试剂 (Reagent)
- 试剂基本信息
- 规格、价格、预警数量、存储条件等

#### 3. 批次 (Lot)
- 试剂批次管理
- 批号、有效期、关联试剂

#### 4. 操作记录 (Operation)
- 所有入库、出库操作记录
- 包含条码号、操作时间、操作用户等

#### 5. 库存 (Inventory)
- 实时库存信息
- 出库统计、库存修正等

#### 6. 用户 (User)
- 用户账户管理
- 权限控制、团队归属

## 安装与部署

### 环境要求
- **前端**: Node.js 20.x 或更高版本
- **后端**: .NET 9.0 SDK 或更高版本
- **操作系统**: Windows 10/11（支持 32 位架构）

### 后端部署

1. **进入后端目录**
   ```bash
   cd LabMangerAPI/LabMangerAPI
   ```

2. **还原NuGet包**
   ```bash
   dotnet restore
   ```

3. **构建项目**
   ```bash
   dotnet build
   ```

4. **运行项目**
   ```bash
   # 开发环境
   dotnet run
   
   # 生产环境
   dotnet run --environment Production
   ```

### 前端部署

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
   npm run build
   ```

5. **预览构建结果**
   ```bash
   npm run preview
   ```

## 配置说明

### 后端配置
- **默认端口**: 8000 (HTTP)
- **开发端口**: 5057 (HTTP), 7246 (HTTPS)
- **数据库**: SQLite (data.db)
- **配置文件**: appsettings.json

### 前端配置
- **开发服务器端口**: 5173
- **构建输出目录**: `out/`
- **配置文件**: `conf.txt` (包含打印机配置、服务器地址等)
- **应用图标**: `icon.ico`

## 主要功能模块

### 1. 用户认证
- 登录/登出功能
- JWT Bearer Token 认证
- 基于角色的权限控制

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
- 批量打印

## API 接口

系统提供完整的 RESTful API 接口，包括：

- **认证接口**: 登录、登出
- **团队管理**: 增删改查
- **试剂管理**: 增删改查、列表查询
- **批次管理**: 增删改查、有效期管理
- **操作记录**: 入库、出库、查询
- **库存管理**: 库存查询、修正
- **用户管理**: 用户信息管理

详细的 API 文档请参考 `项目接口api.md` 文件。

## 开发指南

### 前端开发
1. 使用 electron-vite 4.x 进行构建
2. 使用 Vue 3 Composition API
3. 遵循 Element Plus 设计规范
4. 组件化开发，保持代码复用性
5. 使用 TypeScript 进行类型检查

### 后端开发
1. 使用 ASP.NET Core 9.0 框架
2. SqlSugar ORM 进行数据库操作
3. JWT Bearer Token 进行身份认证
4. 统一的错误处理和响应格式
5. 依赖注入和中间件模式

### 数据库操作
1. 使用 SqlSugar CodeFirst 进行数据库迁移
2. 遵循数据库设计规范
3. 建立合适的索引提高查询性能

## 部署说明

### 生产环境部署
1. 后端使用 IIS 或 Kestrel 进行托管
2. 启用 HTTPS 和反向代理
3. 配置日志记录和错误处理
4. 定期备份数据库

### 桌面应用打包
1. 使用 electron-vite 内置的构建功能
2. 支持 Windows 32 位架构
3. 包含必要的依赖文件
4. 配置应用图标和元信息

## 架构优势

### 技术栈优势
- **高性能**: ASP.NET Core 9.0 提供优秀的性能表现
- **类型安全**: C# 强类型语言，编译时错误检查
- **简单部署**: 单文件部署，无需复杂的环境配置
- **跨平台**: 支持 Windows、Linux、macOS
- **丰富生态**: .NET 生态系统提供丰富的库和工具

### 开发体验
- **热重载**: 开发时自动重新编译和加载
- **调试友好**: 强大的调试工具和错误信息
- **代码生成**: 自动生成API文档和客户端代码
- **依赖注入**: 内置DI容器，便于测试和维护

## 常见问题

### 1. .NET SDK 相关问题
- 确保安装了 .NET 9.0 SDK
- 检查环境变量 PATH 配置
- 使用 `dotnet --version` 验证安装

### 2. 数据库连接问题
- 检查 `appsettings.json` 中的数据库路径配置
- 确保 `data.db` 文件存在且有读写权限
- 验证 SqlSugar 连接字符串格式

### 3. 端口冲突
- 修改 `appsettings.json` 中的端口设置
- 检查防火墙设置
- 使用 `netstat -ano` 查看端口占用

### 4. 打印机配置
- 在 `conf.txt` 中配置正确的打印机名称
- 确保打印机驱动已正确安装

### 5. electron-vite 相关问题
- 确保 Node.js 版本 >= 20.x
- 检查依赖版本兼容性
- 清理 node_modules 并重新安装依赖

## 更新日志

### v3.0.0 (当前版本)
- **后端重构**: 从 Fastify 迁移到 ASP.NET Core 9.0
- **ORM 升级**: 从 Prisma 迁移到 SqlSugar
- **架构优化**: 采用分层架构，提高代码可维护性
- **通用基类**: 创建分页查询和API响应通用基类
- **类型安全**: 使用 C# 强类型语言，提高代码质量

### v2.0.0 (历史版本)
- 使用 electron-vite 4.x 架构
- 升级 Electron 到 27.x
- 优化构建流程和开发体验
- 完整功能实现

## 技术支持

如有问题或建议，请联系开发团队。

---

**注意**: 本系统专为实验室试剂管理设计，请根据实际需求进行配置和使用。 