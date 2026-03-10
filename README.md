# LabManger 实验室管理系统

## 项目概述

LabManger 是一个基于 **Electron + Vue 3** 桌面前端与 **NestJS** 后端服务的实验室试剂管理系统。系统提供试剂信息管理、批次追踪、入库出库、库存监控、操作记录、数据统计与导出等完整功能，支持多小组数据隔离与角色权限控制。

### 主要功能

- 用户认证与 Session 令牌管理
- 多小组（Team）数据隔离
- 角色权限控制（成员 / 组长 / 主任 / 管理员）
- 试剂信息管理（规格、价格、预警数量、存储条件）
- 批次管理（批号、有效期、状态）
- 入库 / 出库 / 特殊出库操作
- 条码自动生成与打印
- 库存监控（数量预警、有效期预警）
- 库存修正（auditAll）
- 操作记录查询与批量删除
- 库存统计图表（时间序列）
- 盘库表 / 操作记录 Excel 导出

---

## 技术架构

### 前端（Electron + Vue 3）

| 技术 | 版本 | 说明 |
|---|---|---|
| Electron | 21.x | 桌面应用容器 |
| Vue 3 | ^3.5 | 响应式前端框架 |
| electron-vite | ^4.0 | 构建工具 |
| Element Plus | ^2.4 | UI 组件库 |
| Vue Router | ^4.5 | 前端路由 |
| Axios | ^1.10 | HTTP 客户端 |
| vue-data-ui | ^2.17 | 图表组件 |
| ExcelJS | ^4.4 | Excel 导出 |
| jsbarcode | ^3.12 | 条码生成 |

### 后端（NestJS）

| 技术 | 版本 | 说明 |
|---|---|---|
| NestJS | ^11.x | 后端框架 |
| Fastify | ^5.x | HTTP 服务器（替代 Express）|
| Prisma ORM | ^5.22 | 数据库访问层 |
| SQLite | — | 嵌入式数据库 |
| Zod | ^4.x | 请求参数校验与类型推导 |
| TypeScript | ^5.x | 类型安全 |

---

## 项目结构

```
LabManger-dev/
├── electron-vite/               # 前端桌面应用
│   ├── src/
│   │   ├── main/                # Electron 主进程
│   │   ├── preload/             # 预加载脚本（桥接打印等原生能力）
│   │   └── renderer/            # Vue 渲染进程
│   │       └── src/
│   │           ├── api/         # 后端请求封装
│   │           │   ├── request.js       # Axios 实例 + Session 拦截器
│   │           │   ├── auth.js          # 登录 / 登出
│   │           │   ├── team.js          # 小组管理
│   │           │   ├── user.js          # 用户管理
│   │           │   ├── reagent.js       # 试剂管理
│   │           │   ├── lot.js           # 批次管理
│   │           │   ├── operation.js     # 操作记录
│   │           │   └── inventory.js     # 库存管理
│   │           ├── components/  # Vue 页面组件
│   │           │   ├── signin.vue       # 登录页
│   │           │   ├── signout.vue      # 登出页
│   │           │   ├── home.vue         # 首页（仪表盘）
│   │           │   ├── homebar.vue      # 侧边导航栏
│   │           │   ├── team.vue         # 小组管理
│   │           │   ├── user.vue         # 用户管理
│   │           │   ├── reagent.vue      # 试剂模板管理
│   │           │   ├── lot.vue          # 批次管理
│   │           │   ├── inbound.vue      # 入库
│   │           │   ├── outbound.vue     # 出库
│   │           │   ├── operation.vue    # 操作记录
│   │           │   ├── statistics.vue   # 库存统计
│   │           │   └── statistics_chart.vue  # 统计图表
│   │           ├── router/      # 路由配置
│   │           └── utils/       # 工具函数
│   │               ├── format.js        # 日期格式化等
│   │               ├── permission.js    # 权限判断
│   │               ├── exportexcel.js   # Excel 导出
│   │               └── eventBus.js      # 全局事件总线
│   ├── conf.txt                 # 运行时配置（服务器地址、打印机等）
│   └── package.json
│
└── LabMangerNest/               # 后端 NestJS 服务
    ├── src/
    │   ├── auth/                # 登录 / 登出模块
    │   ├── team/                # 小组管理模块
    │   ├── user/                # 用户管理模块
    │   ├── reagent/             # 试剂管理模块
    │   ├── lot/                 # 批次管理模块
    │   ├── operation/           # 操作记录模块
    │   ├── inventory/           # 库存管理模块
    │   ├── schemas/             # 前端 Zod Schema 下发接口
    │   ├── prisma/              # Prisma 服务封装
    │   └── common/
    │       ├── dtos/            # 通用 DTO（ApiRequest / ApiResponse）
    │       ├── enums/           # 枚举（Status / UserRole / OperationAction）
    │       ├── decorators/      # 自定义装饰器（@ZodQuery / @ZodBody / @SessionUser）
    │       ├── guards/          # SessionGuard（全局 Session 鉴权）
    │       ├── utils/           # 工具函数（teamScope 等）
    │       └── init/            # 启动时数据库初始化
    ├── prisma/
    │   ├── schema.prisma        # 数据库模型定义
    │   └── data.db              # SQLite 数据库文件（运行时生成）
    └── package.json
```

---

## 数据库模型

数据库使用 SQLite，通过 Prisma ORM 管理。

| 模型 | 说明 |
|---|---|
| `Team` | 实验室小组，所有业务数据归属于小组 |
| `User` | 用户账户，含角色和所属小组 |
| `Reagent` | 试剂模板（名称、规格、价格、预警配置）|
| `Lot` | 批次（批号、有效期、归属试剂）|
| `Operation` | 操作记录（入库/出库，含条码、用户、时间）|
| `Inventory` | 库存（试剂+批次维度的当前数量）|
| `Session` | 登录会话令牌（sessionId + 用户信息）|

### Status 枚举（所有业务表通用）

| 值 | 含义 |
|---|---|
| `0` | 启用（Enable）|
| `1` | 停用（Disable）|
| `2` | 软删除（Delete，查询时过滤）|

### UserRole 枚举

| 值 | 角色 | 数据权限 |
|---|---|---|
| `0` | 成员（Member）| 仅本小组数据 |
| `1` | 组长（Leader）| 仅本小组数据 |
| `2` | 主任（Director）| 所有小组数据 |
| `3` | 管理员（Admin）| 所有小组数据 |

---

## 认证机制

系统使用 **Session 令牌** 认证：

1. 登录时后端生成 `sessionId`（UUID 去掉连字符），写入 `Session` 表，返回给前端
2. 前端将 `sessionId` 存入 `localStorage`，每次请求通过 `sessionid` 请求头携带
3. 后端 `SessionGuard` 全局拦截，校验 `sessionid` 是否存在于数据库
4. 校验通过后，将 Session 中的 `userId / teamId / role` 注入到 `@SessionUser()` 装饰器
5. `/auth/signin` 和 `/auth/signout` 接口标记 `@Public()`，不参与 Session 校验

---

## API 接口概览

所有接口均返回统一结构：

```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "pageSize": 10, "total": 100, "totalPage": 10 }
}
```

| 模块 | 路径 | 方法 | 说明 |
|---|---|---|---|
| 认证 | `/auth/signin` | POST | 登录，返回 sessionId |
| 认证 | `/auth/signout` | GET | 登出，删除 Session |
| 小组 | `/team/show` | GET | 分页查询小组 |
| 小组 | `/team/add` | POST | 新增小组 |
| 小组 | `/team/update` | PUT | 修改小组 |
| 小组 | `/team/del` | PUT | 删除小组（软删除）|
| 小组 | `/team/showAll` | GET | 获取全部启用小组（下拉用）|
| 用户 | `/user/show` | GET | 分页查询用户 |
| 用户 | `/user/add` | POST | 新增用户 |
| 用户 | `/user/update` | PUT | 修改用户 |
| 用户 | `/user/del` | PUT | 删除用户（软删除）|
| 试剂 | `/reagent/show` | GET | 分页查询试剂 |
| 试剂 | `/reagent/add` | POST | 新增试剂 |
| 试剂 | `/reagent/update` | PUT | 修改试剂 |
| 试剂 | `/reagent/del` | PUT | 删除试剂（软删除）|
| 试剂 | `/reagent/showAll` | GET | 获取全部启用试剂（下拉用）|
| 批次 | `/lot/show` | GET | 分页查询批次 |
| 批次 | `/lot/add` | POST | 新增批次 |
| 批次 | `/lot/update` | PUT | 修改批次 |
| 批次 | `/lot/del` | PUT | 删除批次（软删除，同步删除库存）|
| 批次 | `/lot/showAll` | GET | 获取全部启用批次（下拉用）|
| 操作 | `/operation/inbound` | POST | 批量入库 |
| 操作 | `/operation/outbound` | POST | 扫码出库 |
| 操作 | `/operation/specialOutbound` | POST | 手动批量出库 |
| 操作 | `/operation/show` | GET | 分页查询操作记录（支持筛选）|
| 操作 | `/operation/showAll` | GET | 获取全部操作记录（导出用，上限 9999999）|
| 操作 | `/operation/update` | PUT | 修改操作记录 |
| 操作 | `/operation/del` | PUT | 删除操作记录（软删除）|
| 库存 | `/inventory/show` | GET | 分页查询库存（含预警状态）|
| 库存 | `/inventory/showAll` | GET | 获取全部库存（导出用，上限 9999999）|
| 库存 | `/inventory/auditAll` | POST | 重新计算全部库存数量 |
| 库存 | `/inventory/statistics` | GET | 时间序列库存统计（图表）|
| Schema | `/schemas` | GET | 下发所有 Zod Schema 供前端校验 |

---

## 安装与启动

### 环境要求

- Node.js 20.x 或以上
- npm 9.x 或以上

### 后端启动（LabMangerNest）

```bash
cd LabMangerNest

# 安装依赖
npm install
#生成prisma客户端
npx prisma generate
# 初始化数据库（首次运行或 schema 变更后执行）
npx prisma migrate dev

# 开发模式（热重载）
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

后端默认监听 `http://localhost:3000`。

### 前端启动（electron-vite）

```bash
cd electron-vite

# 安装依赖
npm install

# 开发模式（Electron 窗口 + 热重载）
npm run dev

# 打包为 Windows 桌面应用
npm run build:win
```

### 前端配置文件（conf.txt）

位于 `electron-vite/conf.txt`，格式为 `KEY=VALUE`，包含：

```
SERVER=http://localhost:3000
PRINTER=打印机名称
```

---

## 开发规范

### 后端

- 每个模块包含 `*.controller.ts` / `*.service.ts` / `*.dto.ts` / `*.module.ts` / `index.ts`
- DTO 使用 Zod 定义，同时用于运行时校验和 TypeScript 类型推导
- GET 请求参数通过 `@ZodQuery(Schema)` 装饰器注入，自动执行 `z.coerce` 类型转换
- POST/PUT 请求体通过 `@ZodBody(Schema)` 装饰器注入
- 当前登录用户信息通过 `@SessionUser()` 注入，类型为 `{ userId, teamId, role }`
- 数据隔离通过 `teamScope(session)` 工具函数实现：Director/Admin 不加 teamId 过滤，其余角色只查自己小组
- 所有字段命名使用 **驼峰命名（camelCase）**

### 前端

- API 层统一封装在 `src/api/` 目录，函数命名 `api_模块_操作`
- 参数字段兼容驼峰和小写（使用 `??` 运算符）
- 分页 meta 从 `data.meta.totalPage` 等字段读取
- 嵌套响应数据（如 `reagent.name`）在组件 `.map()` 时展开为扁平字段
- 权限判断通过 `get_permission('权限名')` 函数，依据 `localStorage.role` 查表

---

## 常见问题

### 数据库表不存在

首次运行或删除数据库文件后需执行迁移：

```bash
cd LabMangerNest
npx prisma migrate dev
```

### Session 无效（非法请求）

- 确认前端 `request.js` 中请求头字段名为 `sessionid`（全小写）
- 重新登录刷新 localStorage 中的 sessionId 和 role

### GET 参数类型错误（Expected number, received String）

所有 GET 请求的数字参数（`page`、`pageSize` 等）在 DTO 中已使用 `z.coerce.number()` 自动转换，无需前端处理。

### 导出 Excel 数据为空

导出函数使用 `/showAll` 接口（无分页限制），确认后端 `showAll` 路由已注册。

---

## 版本历史

### v4.0.0（当前版本）

- 后端从 ASP.NET Core 迁移至 **NestJS + Fastify**
- ORM 从 SqlSugar 迁移至 **Prisma**
- 认证从 JWT 迁移至 **Session 令牌**（存储于数据库）
- 前端重构：统一驼峰命名，修复所有分页、嵌套字段问题
- 新增库存统计图表（时间序列）
- 新增 `showAll` 接口用于无限制导出
- 新增自定义装饰器 `@ZodQuery` / `@ZodBody` / `@SessionUser`
- 新增 `teamScope` 数据隔离机制，支持主任/管理员查看全部数据
- 前端组件重命名：`template.vue` → `reagent.vue`，`list_operation.vue` → `operation.vue`，`login.vue` → `signin.vue`

### v3.0.0（历史）

- 后端从 Fastify 迁移至 ASP.NET Core 9.0
- ORM 从 Prisma 迁移至 SqlSugar

### v2.0.0（历史）

- 使用 electron-vite 4.x 架构
- 升级 Electron 到 27.x

---

> 本系统专为实验室试剂管理设计，请根据实际环境配置服务器地址和打印机。
