# LabManger 系统架构文档

## 系统架构概览

LabManger 采用前后端分离的架构设计，前端使用 Electron + Vue.js 构建桌面应用，后端使用 Fastify 框架提供 RESTful API 服务。

```
┌─────────────────────────────────────────────────────────────┐
│                    LabManger 系统架构                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐              ┌─────────────────────┐   │
│  │   Electron      │              │     Fastify         │   │
│  │   Desktop App   │◄────────────►│   Backend Server    │   │
│  │                 │   HTTP/JSON  │                     │   │
│  │  ┌───────────┐  │              │  ┌───────────────┐  │   │
│  │  │   Vue.js  │  │              │  │   Prisma      │  │   │
│  │  │  Frontend │  │              │  │     ORM       │  │   │
│  │  └───────────┘  │              │  └───────────────┘  │   │
│  │                 │              │         │           │   │
│  │  ┌───────────┐  │              │  ┌───────────────┐  │   │
│  │  │ Element   │  │              │  │   SQLite      │  │   │
│  │  │   Plus    │  │              │  │  Database     │  │   │
│  │  └───────────┘  │              │  └───────────────┘  │   │
│  └─────────────────┘              └─────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 技术栈详解

### 前端技术栈

#### 1. Electron (v20.3.12)
- **作用**: 跨平台桌面应用框架
- **优势**: 
  - 使用 Web 技术构建桌面应用
  - 支持 Windows、macOS、Linux
  - 丰富的原生 API 支持
- **应用场景**: 
  - 主进程管理应用生命周期
  - 渲染进程处理用户界面
  - IPC 通信处理打印功能

#### 2. Vue.js (v3)
- **作用**: 渐进式 JavaScript 框架
- **特性**:
  - Composition API
  - 响应式数据绑定
  - 组件化开发
- **应用场景**:
  - 用户界面构建
  - 状态管理
  - 路由控制

#### 3. Element Plus (v2.9.8)
- **作用**: Vue 3 组件库
- **优势**:
  - 丰富的 UI 组件
  - 一致的设计语言
  - 良好的可定制性
- **应用场景**:
  - 表单组件
  - 数据表格
  - 消息提示
  - 对话框

#### 4. Vite (v6.0.11)
- **作用**: 现代前端构建工具
- **优势**:
  - 快速的开发服务器
  - 高效的构建过程
  - 丰富的插件生态
- **应用场景**:
  - 开发环境热重载
  - 生产环境打包
  - 资源优化

### 后端技术栈

#### 1. Fastify (v5.3.3)
- **作用**: 高性能 Node.js Web 框架
- **优势**:
  - 极快的性能
  - 低内存占用
  - 类型安全
  - 插件化架构
- **应用场景**:
  - RESTful API 服务
  - 中间件处理
  - 错误处理

#### 2. Prisma (v6.9.0)
- **作用**: 现代数据库 ORM
- **优势**:
  - 类型安全的数据库客户端
  - 自动生成的迁移文件
  - 直观的数据模型定义
- **应用场景**:
  - 数据库模型定义
  - 数据查询和操作
  - 数据库迁移

#### 3. SQLite
- **作用**: 轻量级关系型数据库
- **优势**:
  - 零配置
  - 单文件存储
  - 跨平台支持
- **应用场景**:
  - 本地数据存储
  - 开发环境数据库
  - 小型部署

#### 4. JWT (jsonwebtoken)
- **作用**: 无状态身份认证
- **优势**:
  - 无需服务器存储会话
  - 支持跨域认证
  - 自包含信息
- **应用场景**:
  - 用户登录认证
  - API 访问控制
  - 权限验证

## 系统架构设计

### 1. 分层架构

```
┌─────────────────────────────────────────────────────────────┐
│                        表现层 (Presentation)                │
│  ┌─────────────────┐              ┌─────────────────────┐   │
│  │   Vue.js UI     │              │   Electron Main     │   │
│  │   Components    │              │   Process           │   │
│  └─────────────────┘              └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                        业务层 (Business)                    │
│  ┌─────────────────┐              ┌─────────────────────┐   │
│  │   Vuex/Pinia    │              │   Fastify Routes    │   │
│  │   State Mgmt    │              │   & Controllers     │   │
│  └─────────────────┘              └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                        数据层 (Data)                        │
│  ┌─────────────────┐              ┌─────────────────────┐   │
│  │   API Client    │              │   Prisma ORM        │   │
│  │   (Axios)       │              │   & Database        │   │
│  └─────────────────┘              └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2. 模块化设计

#### 前端模块
```
electron/
├── src/
│   ├── components/          # Vue 组件
│   │   ├── team/           # 团队管理组件
│   │   ├── reagent/        # 试剂管理组件
│   │   ├── lot/            # 批次管理组件
│   │   ├── operation/      # 操作管理组件
│   │   └── common/         # 通用组件
│   ├── api/                # API 接口
│   ├── router/             # 路由配置
│   ├── utils/              # 工具函数
│   └── assets/             # 静态资源
├── main.js                 # Electron 主进程
├── preload.js              # 预加载脚本
└── package.json            # 项目配置
```

#### 后端模块
```
fastify/
├── router/                 # 路由定义
│   ├── team.js            # 团队路由
│   ├── reagent.js         # 试剂路由
│   ├── lot.js             # 批次路由
│   └── operation.js       # 操作路由
├── plugin/                 # 插件
│   ├── auth.js            # 认证插件
│   ├── errorHandler.js    # 错误处理
│   └── scheduler.js       # 定时任务
├── prisma/                 # 数据库
│   ├── schema.prisma      # 数据模型
│   ├── migrations/        # 迁移文件
│   └── data.db            # 数据库文件
├── types/                  # TypeScript 类型
└── app.ts                  # 应用入口
```

## 数据流设计

### 1. 用户操作流程

```
用户操作 → Vue组件 → API调用 → Fastify路由 → Prisma查询 → SQLite数据库
    ↑                                                              │
    └────────────────── 响应数据 ──────────────────────────────────┘
```

### 2. 认证流程

```
登录请求 → JWT验证 → 用户信息 → Token生成 → 前端存储 → 后续请求携带Token
```

### 3. 数据同步流程

```
前端状态 → API请求 → 后端处理 → 数据库更新 → 响应结果 → 前端状态更新
```

## 数据库设计

### 1. 实体关系图

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    team     │    │   reagent   │    │     lot     │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ name        │    │ name        │    │ name        │
│ phone       │    │ teamid (FK) │    │ reagentid   │
│ note        │    │ specs       │    │ (FK)        │
│ using       │    │ warn_number │    │ exp_date    │
└─────────────┘    │ price       │    │ using       │
       │           │ using       │    └─────────────┘
       │           └─────────────┘            │
       │                    │                 │
       │                    │                 │
       │           ┌─────────────┐    ┌─────────────┐
       │           │  operation  │    │  inventory  │
       │           ├─────────────┤    ├─────────────┤
       │           │ id (PK)     │    │ id (PK)     │
       │           │ reagentid   │    │ reagentid   │
       │           │ (FK)        │    │ (FK)        │
       │           │ lotid (FK)  │    │ lotid (FK)  │
       │           │ userid (FK) │    │ quantity    │
       │           │ action      │    │ using       │
       │           │ barcode     │    └─────────────┘
       │           │ using       │
       │           └─────────────┘
       │
       │           ┌─────────────┐
       │           │    user     │
       │           ├─────────────┤
       │           │ id (PK)     │
       │           │ username    │
       │           │ password    │
       │           │ teamid (FK) │
       │           │ permission  │
       │           │ using       │
       │           └─────────────┘
       └───────────────────┘
```

### 2. 索引设计

```sql
-- 团队表索引
CREATE INDEX idx_team_using ON team(using);

-- 试剂表索引
CREATE INDEX idx_reagent_team_using ON reagent(teamid, using);
CREATE INDEX idx_reagent_name_using ON reagent(name, using);

-- 批次表索引
CREATE INDEX idx_lot_reagent_using ON lot(reagentid, using);

-- 操作表索引
CREATE INDEX idx_operation_reagent_lot_using ON operation(reagentid, lotid, using);
CREATE INDEX idx_operation_time ON operation(creation_time);
CREATE INDEX idx_operation_barcode_using ON operation(barcodenumber, using);
CREATE INDEX idx_operation_action_using ON operation(operation_action, using);

-- 库存表唯一索引
CREATE UNIQUE INDEX idx_inventory_unique ON inventory(reagentid, lotid, using);
```

## 安全设计

### 1. 认证与授权

#### JWT Token 结构
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userid": 1,
    "username": "admin",
    "teamid": 1,
    "permission": "admin",
    "iat": 1640995200,
    "exp": 1641081600
  },
  "signature": "HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)"
}
```

#### 权限控制
```typescript
// 权限级别
enum Permission {
  READ = 'read',           // 只读权限
  WRITE = 'write',         // 读写权限
  ADMIN = 'admin'          // 管理员权限
}

// 权限检查中间件
const checkPermission = (requiredPermission: Permission) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user
    if (user.permission !== requiredPermission && user.permission !== 'admin') {
      return reply.status(403).send({
        status: 1,
        msg: '权限不足',
        data: null
      })
    }
  }
}
```

### 2. 数据验证

#### 输入验证
```typescript
// 请求参数验证 Schema
const addReagentSchema = {
  body: {
    type: 'object',
    required: ['name', 'teamid'],
    properties: {
      name: { 
        type: 'string', 
        minLength: 1, 
        maxLength: 100 
      },
      teamid: { 
        type: 'integer', 
        minimum: 1 
      },
      specifications: { 
        type: 'string', 
        maxLength: 200 
      },
      warn_number: { 
        type: 'integer', 
        minimum: 0 
      },
      price: { 
        type: 'integer', 
        minimum: 0 
      }
    }
  }
}
```

#### SQL 注入防护
- 使用 Prisma ORM 进行参数化查询
- 避免直接拼接 SQL 语句
- 输入数据转义和验证

### 3. 错误处理

#### 统一错误处理
```typescript
// 全局错误处理器
fastify.setErrorHandler(function (error, request, reply) {
  // 验证错误
  if (error.validation) {
    return reply.status(400).send({
      status: 1,
      msg: '请求数据格式错误',
      data: error.validation
    })
  }
  
  // 数据库错误
  if (error.code === 'P2002') {
    return reply.status(409).send({
      status: 1,
      msg: '数据已存在',
      data: null
    })
  }
  
  // 通用错误
  fastify.log.error(error)
  return reply.status(500).send({
    status: 1,
    msg: '服务器内部错误',
    data: null
  })
})
```

## 性能优化

### 1. 前端优化

#### 代码分割
```javascript
// 路由懒加载
const Team = () => import('@/components/team.vue')
const Reagent = () => import('@/components/reagent.vue')

// 组件懒加载
const TeamEditBox = defineAsyncComponent(() => 
  import('@/components/team_editbox.vue')
)
```

#### 资源优化
```javascript
// Vite 配置优化
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          element: ['element-plus']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### 2. 后端优化

#### 数据库查询优化
```typescript
// 使用索引优化查询
const reagents = await prisma.reagent.findMany({
  where: {
    using: true,
    teamid: teamId
  },
  include: {
    team: true,
    inventory: {
      where: { using: true }
    }
  },
  orderBy: { creation_time: 'desc' }
})

// 分页查询
const [data, total] = await Promise.all([
  prisma.reagent.findMany({
    where,
    skip: (page - 1) * pagesize,
    take: pagesize,
    orderBy: { id: 'desc' }
  }),
  prisma.reagent.count({ where })
])
```

#### 缓存策略
```typescript
// 内存缓存
const cache = new Map()

const getCachedData = async (key: string, fetcher: () => Promise<any>) => {
  if (cache.has(key)) {
    return cache.get(key)
  }
  
  const data = await fetcher()
  cache.set(key, data)
  
  // 设置过期时间
  setTimeout(() => cache.delete(key), 5 * 60 * 1000) // 5分钟
  
  return data
}
```

### 3. 并发处理

#### 多进程支持
```typescript
// 生产环境多进程
if (process.env.NODE_ENV === 'production') {
  if (cluster.isPrimary) {
    // 主进程
    for (let i = 0; i < 3; i++) {
      cluster.fork()
    }
    
    cluster.on('exit', (worker, code, signal) => {
      console.log(`进程 ${worker.process.pid} 已退出`)
      cluster.fork() // 重启进程
    })
  } else {
    // 子进程
    start()
  }
} else {
  // 开发环境单进程
  start()
}
```

## 部署架构

### 1. 开发环境

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Electron      │    │   Vite Dev      │    │   Fastify Dev   │
│   Desktop App   │◄──►│   Server        │◄──►│   Server        │
│                 │    │   (Port 3000)   │    │   (Port 8000)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2. 生产环境

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Electron      │    │   Static Files  │    │   Fastify       │
│   Desktop App   │◄──►│   (Built Vue)   │◄──►│   Production    │
│                 │    │                 │    │   Server        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                              ┌─────────────────┐
                                              │   SQLite        │
                                              │   Database      │
                                              └─────────────────┘
```

### 3. 容器化部署 (可选)

```dockerfile
# 后端 Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./fastify
    ports:
      - "8000:8000"
    volumes:
      - ./fastify/prisma:/app/prisma
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./prisma/data.db
```

## 监控与日志

### 1. 日志系统

#### 前端日志
```javascript
// 前端错误日志
window.addEventListener('error', (event) => {
  console.error('前端错误:', event.error)
  // 发送到后端日志服务
})

// Vue 错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue 错误:', err, info)
}
```

#### 后端日志
```typescript
// Pino 日志配置
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard'
    }
  }
})

// 请求日志中间件
fastify.addHook('onRequest', async (request, reply) => {
  request.log.info({ url: request.url, method: request.method })
})
```

### 2. 性能监控

#### 前端性能
```javascript
// 页面加载性能
window.addEventListener('load', () => {
  const perfData = performance.getEntriesByType('navigation')[0]
  console.log('页面加载时间:', perfData.loadEventEnd - perfData.loadEventStart)
})

// API 响应时间
const apiTimer = {
  start: (url) => {
    apiTimer[url] = Date.now()
  },
  end: (url) => {
    const duration = Date.now() - apiTimer[url]
    console.log(`API ${url} 响应时间:`, duration + 'ms')
  }
}
```

#### 后端性能
```typescript
// 请求响应时间监控
fastify.addHook('onResponse', async (request, reply) => {
  const responseTime = reply.getResponseTime()
  fastify.log.info({
    url: request.url,
    method: request.method,
    statusCode: reply.statusCode,
    responseTime: `${responseTime}ms`
  })
})
```

## 扩展性设计

### 1. 插件化架构

#### 前端插件
```javascript
// 插件注册机制
const plugins = {
  register(name, plugin) {
    this[name] = plugin
  },
  
  get(name) {
    return this[name]
  }
}

// 使用插件
plugins.register('barcode', {
  generate: (data) => { /* 条码生成逻辑 */ },
  scan: (callback) => { /* 条码扫描逻辑 */ }
})
```

#### 后端插件
```typescript
// Fastify 插件系统
export default async function customPlugin(fastify: FastifyInstance) {
  // 插件逻辑
  fastify.decorate('customMethod', () => {
    return 'custom value'
  })
}

// 注册插件
await fastify.register(customPlugin)
```

### 2. 模块化设计

#### 功能模块
- 团队管理模块
- 试剂管理模块
- 批次管理模块
- 操作管理模块
- 库存管理模块
- 预警管理模块

#### 通用模块
- 认证模块
- 权限模块
- 日志模块
- 工具模块
- 配置模块

### 3. 配置管理

#### 环境配置
```typescript
// 配置管理
const config = {
  development: {
    database: 'file:./prisma/data.db',
    port: 8000,
    logLevel: 'debug'
  },
  production: {
    database: 'file:./prisma/data.db',
    port: 8000,
    logLevel: 'info'
  }
}

export default config[process.env.NODE_ENV || 'development']
```

---

这份架构文档详细描述了 LabManger 系统的技术架构、设计原则和实现方案，为系统的开发、维护和扩展提供了全面的技术指导。 