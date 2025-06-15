# LabManger 开发文档

## 开发环境搭建

### 1. 环境要求
- Node.js 18.x 或更高版本
- npm 9.x 或更高版本
- Git
- VS Code (推荐)
- SQLite 数据库

### 2. 开发工具推荐
- **代码编辑器**: VS Code
- **数据库工具**: SQLite Browser 或 DBeaver
- **API 测试**: Postman 或 Insomnia
- **Git 客户端**: Git Bash 或 SourceTree

### 3. VS Code 插件推荐
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- Element Plus Snippets
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

## 项目初始化

### 1. 克隆项目
```bash
git clone <repository-url>
cd LabManger
```

### 2. 后端初始化
```bash
cd fastify
npm install
npx prisma generate
npx prisma migrate dev
```

### 3. 前端初始化
```bash
cd electron
npm install
```

## 代码规范

### 1. 前端代码规范 (Vue.js)

#### 组件命名
- 使用 PascalCase 命名组件文件
- 组件名应该具有描述性
```javascript
// 好的命名
TeamEditBox.vue
ReagentList.vue
InventoryMonitor.vue

// 避免的命名
Edit.vue
List.vue
Monitor.vue
```

#### 组件结构
```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup>
// 导入
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const loading = ref(false)
const formData = reactive({
  name: '',
  phone: ''
})

// 方法
const handleSubmit = async () => {
  try {
    loading.value = true
    // 业务逻辑
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped>
/* 样式 */
</style>
```

#### API 调用规范
```javascript
// api/team.js
import request from '@/utils/request'

export const teamApi = {
  // 获取团队列表
  getList(params) {
    return request({
      url: '/team/show/',
      method: 'get',
      params
    })
  },
  
  // 添加团队
  add(data) {
    return request({
      url: '/team/add/',
      method: 'post',
      data
    })
  },
  
  // 更新团队
  update(data) {
    return request({
      url: '/team/update/',
      method: 'put',
      data
    })
  }
}
```

### 2. 后端代码规范 (Fastify)

#### 路由定义
```typescript
// router/team.ts
import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function teamRoutes(fastify: FastifyInstance) {
  // 获取团队列表
  fastify.get('/team/show/', async (request, reply) => {
    try {
      const { name, page = 1, pagesize = 10 } = request.query as any
      
      const where = {
        using: true,
        ...(name && { name: { contains: name } })
      }
      
      const [data, total] = await Promise.all([
        prisma.team.findMany({
          where,
          skip: (page - 1) * pagesize,
          take: pagesize,
          orderBy: { id: 'desc' }
        }),
        prisma.team.count({ where })
      ])
      
      return {
        status: 0,
        msg: '成功',
        data,
        total,
        page,
        pagesize,
        totalpages: Math.ceil(total / pagesize)
      }
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        status: 1,
        msg: '服务器错误',
        data: error
      })
    }
  })
  
  // 添加团队
  fastify.post('/team/add/', async (request, reply) => {
    try {
      const { name, phone, note, using } = request.body as any
      
      const team = await prisma.team.create({
        data: {
          name,
          phone,
          note,
          using
        }
      })
      
      return {
        status: 0,
        msg: '成功',
        data: team
      }
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        status: 1,
        msg: '服务器错误',
        data: error
      })
    }
  })
}
```

#### 错误处理
```typescript
// plugin/errorHandler.ts
import { FastifyInstance } from 'fastify'

export default async function errorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler(function (error, request, reply) {
    if (error.validation) {
      reply.status(400).send({
        status: 1,
        msg: '请求数据格式错误',
        data: error.validation
      })
    } else {
      fastify.log.error(error)
      reply.status(500).send({
        status: 1,
        msg: '服务器错误',
        data: error
      })
    }
  })
}
```

### 3. 数据库操作规范

#### Prisma 查询示例
```typescript
// 复杂查询示例
const result = await prisma.reagent.findMany({
  where: {
    using: true,
    team: {
      using: true
    }
  },
  include: {
    team: true,
    lot: {
      where: {
        using: true,
        expiration_date: {
          gte: new Date()
        }
      }
    },
    inventory: {
      where: {
        using: true
      }
    }
  },
  orderBy: {
    creation_time: 'desc'
  }
})
```

#### 事务处理
```typescript
// 入库操作事务示例
const result = await prisma.$transaction(async (tx) => {
  // 1. 创建操作记录
  const operation = await tx.operation.create({
    data: {
      reagentid: reagentId,
      lotid: lotId,
      userid: userId,
      operation_action: 'inbound',
      barcodenumber: barcode,
      using: true
    }
  })
  
  // 2. 更新或创建库存
  const inventory = await tx.inventory.upsert({
    where: {
      reagentid_lotid_using: {
        reagentid: reagentId,
        lotid: lotId,
        using: true
      }
    },
    update: {
      inventory_number: {
        increment: quantity
      }
    },
    create: {
      reagentid: reagentId,
      lotid: lotId,
      inventory_number: quantity,
      last_outbound_time: new Date(),
      lastweek_outbound_number: 0,
      using: true
    }
  })
  
  return { operation, inventory }
})
```

## API 开发指南

### 1. RESTful API 设计原则

#### URL 设计
```
GET    /team/show/          # 获取团队列表
POST   /team/add/           # 创建团队
PUT    /team/update/        # 更新团队
DELETE /team/delete/:id     # 删除团队
```

#### 响应格式
```typescript
// 成功响应
{
  status: 0,
  msg: '成功',
  data: any,
  total?: number,
  page?: number,
  pagesize?: number,
  totalpages?: number
}

// 错误响应
{
  status: 1,
  msg: '错误信息',
  data?: any
}
```

### 2. 认证与授权

#### JWT 中间件
```typescript
// plugin/auth.ts
import { FastifyInstance } from 'fastify'
import jwt from '@fastify/jwt'

export default async function authPlugin(fastify: FastifyInstance) {
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key'
  })
  
  fastify.addHook('onRequest', async (request, reply) => {
    // 跳过登录接口的认证
    if (request.url === '/auth/login') {
      return
    }
    
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.status(401).send({
        status: 1,
        msg: '未授权访问',
        data: null
      })
    }
  })
}
```

### 3. 数据验证

#### 请求参数验证
```typescript
// 使用 Fastify 的 schema 验证
const addTeamSchema = {
  body: {
    type: 'object',
    required: ['name', 'phone'],
    properties: {
      name: { type: 'string', minLength: 1 },
      phone: { type: 'string', pattern: '^[0-9-]+$' },
      note: { type: 'string' },
      using: { type: 'boolean' }
    }
  }
}

fastify.post('/team/add/', {
  schema: addTeamSchema
}, async (request, reply) => {
  // 处理逻辑
})
```

## 前端开发指南

### 1. 组件开发

#### 表单组件示例
```vue
<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="100px"
  >
    <el-form-item label="团队名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入团队名称" />
    </el-form-item>
    
    <el-form-item label="联系电话" prop="phone">
      <el-input v-model="formData.phone" placeholder="请输入联系电话" />
    </el-form-item>
    
    <el-form-item label="备注" prop="note">
      <el-input
        v-model="formData.note"
        type="textarea"
        placeholder="请输入备注信息"
      />
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="handleSubmit" :loading="loading">
        保存
      </el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { teamApi } from '@/api/team'

const emit = defineEmits(['success', 'cancel'])

const formRef = ref()
const loading = ref(false)

const formData = reactive({
  name: '',
  phone: '',
  note: '',
  using: true
})

const rules = {
  name: [
    { required: true, message: '请输入团队名称', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^[0-9-]+$/, message: '请输入正确的电话号码', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    
    await teamApi.add(formData)
    ElMessage.success('添加成功')
    emit('success')
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>
```

### 2. 状态管理

#### 使用 Pinia (推荐)
```javascript
// stores/team.js
import { defineStore } from 'pinia'
import { teamApi } from '@/api/team'

export const useTeamStore = defineStore('team', {
  state: () => ({
    teams: [],
    loading: false,
    total: 0
  }),
  
  actions: {
    async fetchTeams(params = {}) {
      this.loading = true
      try {
        const response = await teamApi.getList(params)
        this.teams = response.data
        this.total = response.total
      } catch (error) {
        console.error('获取团队列表失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    async addTeam(data) {
      try {
        await teamApi.add(data)
        await this.fetchTeams()
      } catch (error) {
        throw error
      }
    }
  }
})
```

### 3. 路由配置

```javascript
// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/components/home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team',
    name: 'Team',
    component: () => import('@/components/team.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
```

## 测试指南

### 1. 单元测试

#### 前端测试 (Vitest)
```javascript
// tests/components/TeamEditBox.test.js
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TeamEditBox from '@/components/team_editbox.vue'

describe('TeamEditBox', () => {
  it('should render form fields', () => {
    const wrapper = mount(TeamEditBox)
    
    expect(wrapper.find('input[placeholder="请输入团队名称"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="请输入联系电话"]').exists()).toBe(true)
  })
  
  it('should emit success event on submit', async () => {
    const wrapper = mount(TeamEditBox)
    
    await wrapper.find('input[placeholder="请输入团队名称"]').setValue('测试团队')
    await wrapper.find('input[placeholder="请输入联系电话"]').setValue('123-4567')
    await wrapper.find('button[type="primary"]').trigger('click')
    
    expect(wrapper.emitted('success')).toBeTruthy()
  })
})
```

### 2. API 测试

#### 使用 Supertest
```javascript
// tests/api/team.test.js
import request from 'supertest'
import { describe, it, expect } from 'vitest'
import app from '../../fastify/app'

describe('Team API', () => {
  it('should get team list', async () => {
    const response = await request(app)
      .get('/team/show/')
      .expect(200)
    
    expect(response.body.status).toBe(0)
    expect(Array.isArray(response.body.data)).toBe(true)
  })
  
  it('should create new team', async () => {
    const teamData = {
      name: '测试团队',
      phone: '123-4567',
      note: '测试备注',
      using: true
    }
    
    const response = await request(app)
      .post('/team/add/')
      .send(teamData)
      .expect(200)
    
    expect(response.body.status).toBe(0)
    expect(response.body.msg).toBe('成功')
  })
})
```

## 部署指南

### 1. 开发环境

#### 启动开发服务器
```bash
# 终端 1: 启动后端
cd fastify
npm run dev

# 终端 2: 启动前端
cd electron
npm run vue:dev

# 终端 3: 启动 Electron
npm run electron:dev
```

### 2. 生产环境

#### 后端部署
```bash
cd fastify
npm install --production
npm run build
npm start
```

#### 前端打包
```bash
cd electron
npm run vue:build
npm run electron:build
```

### 3. Docker 部署 (可选)

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
```

## 性能优化

### 1. 前端优化

#### 代码分割
```javascript
// 路由懒加载
const Team = () => import('@/components/team.vue')

// 组件懒加载
const TeamEditBox = defineAsyncComponent(() => 
  import('@/components/team_editbox.vue')
)
```

#### 图片优化
```javascript
// 使用 Vite 的图片优化
import.meta.glob('/src/assets/images/*.png', { eager: true })
```

### 2. 后端优化

#### 数据库查询优化
```typescript
// 使用索引
const result = await prisma.reagent.findMany({
  where: {
    using: true,
    teamid: teamId
  },
  include: {
    team: true
  }
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
// 使用 Redis 缓存 (可选)
import Redis from 'ioredis'

const redis = new Redis()

// 缓存团队列表
const getTeams = async () => {
  const cached = await redis.get('teams')
  if (cached) {
    return JSON.parse(cached)
  }
  
  const teams = await prisma.team.findMany()
  await redis.setex('teams', 300, JSON.stringify(teams))
  return teams
}
```

## 安全考虑

### 1. 输入验证
- 所有用户输入都需要验证
- 使用 Prisma 的 schema 验证
- 前端和后端双重验证

### 2. SQL 注入防护
- 使用 Prisma ORM 避免原生 SQL
- 参数化查询
- 输入转义

### 3. XSS 防护
- 输出编码
- CSP 策略
- 输入过滤

### 4. CSRF 防护
- JWT Token 验证
- 请求来源验证
- 同源策略

## 监控与日志

### 1. 日志配置
```typescript
// 使用 Pino 日志
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})
```

### 2. 错误监控
```typescript
// 全局错误处理
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
})
```

---

这份开发文档涵盖了项目的主要开发规范和最佳实践。开发团队应该遵循这些规范来确保代码质量和项目可维护性。 