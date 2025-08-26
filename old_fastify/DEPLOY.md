# Fastify 实验室管理系统 离线部署说明

## 1. 环境要求
- Node.js 18.x 或更高版本（推荐 LTS）
- npm 9.x 或更高版本

## 2. 主要文件说明
- `package.json` / `package-lock.json`：依赖与脚本配置
- `prisma/`：数据库 schema、数据文件、迁移文件夹
- `src/`：主程序源码
- `scripts/`：数据生成、清空、检查等辅助脚本
- `.env`：环境变量配置（如数据库路径、端口等）

## 3. 安装与初始化步骤
```bash
# 1. 解压项目文件到目标目录

# 2. 进入项目目录
cd fastify

# 3. 安装依赖
npm install

# 4. 初始化数据库（如首次部署或结构有变更）
npx prisma migrate deploy

# 5. （可选）生成测试数据
npx tsx scripts/generateData.ts

# 6. 启动项目
npm start
```

## 4. 数据库与测试数据
- 默认数据库为 SQLite，文件位于 `prisma/data.db`
- 如需清空所有数据，可执行：
  ```bash
  npx tsx scripts/generateData.ts --clear
  ```
- 如需批量生成测试数据（300种试剂、500个批号、5000条操作记录，所有试剂 teamid=1）：
  ```bash
  npx tsx scripts/generateData.ts
  ```
- 可用 `npx tsx scripts/checkData.ts` 检查当前数据库数据量

## 5. 配置说明
- `.env` 文件可配置数据库路径、服务端口等
- 默认端口为 3000，可通过 `PORT=xxxx` 修改

## 6. 常见问题
- 依赖安装失败：请确认 Node.js 版本 >= 18，npm >= 9
- 数据库连接失败：检查 `.env` 配置和 `prisma/data.db` 文件
- 端口被占用：修改 `.env` 文件中的 `PORT` 配置
- Windows 环境变量问题：推荐使用 `cross-env` 设置环境变量
- TypeScript/ESM 运行问题：本项目已适配 `tsx`，脚本请用 `npx tsx ...` 运行

## 7. 目录结构简要
- package.json
- package-lock.json
- .env
- tsconfig.json
- prisma/
  - schema.prisma
  - data.db
  - migrations/
- src/
  - app.ts
  - router/
  - plugin/
  - types/
  - utils/
  - view/
  - shemajson/
- scripts/
  - generateData.ts
  - checkData.ts
  - test.ts 