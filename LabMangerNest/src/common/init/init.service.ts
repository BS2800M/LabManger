import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { execSync } from 'child_process';
import { createHash } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InitService implements OnModuleInit {
    // 日志记录器
    private readonly logger = new Logger(InitService.name);

    constructor(private readonly prisma: PrismaService) { }

    async onModuleInit() {
        await this.migrate_init();
    }

    /**
     * 初始化数据库默认数据
     * 参考 .NET 版本的 Migrate.cs 实现
     */
    async migrate_init() {
        this.logger.log('开始执行数据库迁移...');
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        this.logger.log('数据库迁移完成，开始执行初始化检查...');
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
