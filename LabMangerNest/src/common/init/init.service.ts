import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { execSync } from 'child_process';
import { createHash } from 'crypto';
import * as path from 'path';
import { UserPrismaService } from '../../prisma/user-prisma.service';
import { InventoryService } from '../../stock/inventory.service';
import { SensorRecordService } from '../../sensorMonitor/sensorRecord.service';

const PROJECT_ROOT = path.join(__dirname, '../../../../');

@Injectable()
export class InitService implements OnModuleInit {
    private readonly logger = new Logger(InitService.name);

    constructor(
        private readonly userPrisma: UserPrismaService,
        private readonly inventoryService: InventoryService,
        private readonly sensorRecordService: SensorRecordService,
    ) { }

    async onModuleInit() {
        await this.migrateInit();
        this.logger.log('检查试剂过期警告');
        await this.inventoryService.updateExpirationWarning();
        this.logger.log('检查传感器上传超时');
        await this.sensorRecordService.checkUploadTimeout();
        this.logger.log('检查完成');
    }



    async migrateInit() {


        const teamCount = await this.userPrisma.team.count();
        if (teamCount === 0) {
            await this.userPrisma.team.create({
                data: {
                    id: 1,
                    name: '默认小组',
                    note: '系统初始化默认小组',
                    phone: '',
                },
            });
            this.logger.log('没有小组，创建默认小组');
        }

        const userCount = await this.userPrisma.user.count();
        if (userCount === 0) {
            const password = createHash('sha256')
                .update('123456', 'utf8')
                .digest('hex')
                .toUpperCase();

            await this.userPrisma.user.create({
                data: {
                    account: '00010',
                    userName: '管理员',
                    checkerPassWord: password,
                    reviewerPassWord: password,
                    teamId: 1,
                    role: 3,
                },
            });
            this.logger.log('没有用户，创建默认管理员用户 账号00010 用户名管理员 检验者密码123456 审核者密码123456');
        }
    }
}
