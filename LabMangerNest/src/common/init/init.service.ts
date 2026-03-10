import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { execSync } from 'child_process';
import { createHash } from 'crypto';
import * as path from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryService } from '../../inventory/inventory.service';

// 项目根目录（prisma.config.ts、prisma/ 所在位置）
// 编译后 __dirname = dist/src/common/init，向上 4 级到项目根
const PROJECT_ROOT = path.join(__dirname, '../../../../');

@Injectable()
export class InitService implements OnModuleInit {
    // 日志记录器
    private readonly logger = new Logger(InitService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly inventoryService: InventoryService,
    ) { }

    async onModuleInit() {
        await this.migrate_init();
        this.logger.log('服务启动，执行有效期预警检查...');
        await this.inventoryService.updateExpirationWarning();
        this.logger.log('启动时有效期预警检查完成');
    }

    /**
     * 初始化数据库默认数据
     * 参考 .NET 版本的 Migrate.cs 实现
     */
    async migrate_init() {
        this.logger.log('开始执行数据库迁移...');
        try {
            if(process.env.NODE_ENV=='production'){
                execSync('npx prisma migrate deploy', { stdio: 'inherit' });
            }else{
                execSync('npx prisma migrate dev', { stdio: 'inherit' });
            }
            this.logger.log('数据库迁移完成');
        } catch (err) {
            this.logger.error('数据库迁移失败', err instanceof Error ? err.message : String(err));
            throw err;
        }
        // 检查是否有小组，如果没有则创建默认小组
        const teamCount = await this.prisma.team.count();
        if (teamCount === 0) {
            await this.prisma.team.create({
                data: {
                    id: 1,
                    name: '初始小组',
                    note: '默认小组',
                    phone: '',
                },
            });
            this.logger.log('未检测到任何小组，创建一个默认小组');
        }

        // 检查是否有用户，如果没有则创建默认管理员用户
        const userCount = await this.prisma.user.count();
        if (userCount === 0) {
            // 使用 SHA256 对默认密码 "123456" 进行哈希，与 .NET 版本保持一致
            const password = createHash('sha256')
                .update('123456', 'utf8')
                .digest('hex')
                .toUpperCase();

            await this.prisma.user.create({
                data: {
                    userName: 'admin',
                    passWord: password,
                    teamId: 1,
                    role: 3, // 3: Admin
                },
            });
            this.logger.log('未检测到任何用户，创建一个默认用户账户:admin 密码:123456');
        }
    }
    
}
