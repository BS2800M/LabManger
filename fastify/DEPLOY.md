# Fastify 项目离线部署说明

## 部署步骤

1. 环境要求
   - Node.js (推荐版本: 18.x 或更高)
   - npm (推荐版本: 9.x 或更高)

2. 部署文件说明
   - `fastify-1.0.0.tgz`: 项目主文件包
   - `package.json`: 项目配置文件
   - `package-lock.json`: 依赖版本锁定文件
   - `prisma/`: 数据库相关文件
   - 其他项目文件

3. 安装步骤
   ```bash
   # 1. 解压项目文件到目标目录
   
   # 2. 进入项目目录
   cd fastify
   
   # 3. 安装依赖
   npm install
   
   # 4. 初始化数据库（如果需要）
   npx prisma migrate deploy
   
   # 5. 启动项目
   npm start
   ```

4. 注意事项
   - 确保目标环境已安装 Node.js
   - 数据库文件 (prisma/data.db) 已包含在项目中
   - 如需修改数据库配置，请编辑 .env 文件
   - 默认服务端口为 3000，可在 .env 文件中修改

5. 常见问题
   - 如果遇到依赖安装问题，请确保 Node.js 版本正确
   - 如果数据库连接失败，请检查 .env 文件中的数据库配置
   - 如果端口被占用，可以在 .env 文件中修改 PORT 配置

## 文件清单
- fastify-1.0.0.tgz
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