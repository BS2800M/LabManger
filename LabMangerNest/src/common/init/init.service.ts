import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Status, UserRole } from '../enums/enums';
import type { SessionUser } from '../decorators/session-user.decorator';
import { TeamService } from '../../identity/team.service';
import { UserService } from '../../identity/user.service';
import { UserPrismaService } from '../../prisma/user-prisma.service';
import { SensorRecordService } from '../../sensorMonitor/sensorRecord.service';
import { MangerPrismaService } from '../../prisma/manger-prisma.service';


@Injectable()
export class InitService implements OnModuleInit {
    private readonly logger = new Logger(InitService.name);

    constructor(
        private readonly userPrisma: UserPrismaService,
        private readonly mangerPrisma: MangerPrismaService,
        private readonly sensorRecordService: SensorRecordService,
        private readonly teamService: TeamService,
        private readonly userService: UserService,
    ) { }

    private buildSystemSession(teamId: number): SessionUser {
        return {
            sessionId: 'system-init',
            userId: 0,
            teamId,
            role: UserRole.Admin,
            loginType: 'reviewer',
            userName:'system-init',
        };
    }

    async onModuleInit() {
        await this.migrateInit();
        await this.mangerPrisma.$transaction(async (tx) => {
            await this.sensorRecordService.checkUploadTimeout(tx);
        });
    }

    async migrateInit() {
        const userCount = await this.userPrisma.user.count();
        if (userCount !== 0) {
            return;
        }
        await this.userPrisma.$transaction(async (tx) => {
            const bootstrapSession = this.buildSystemSession(0);
            const teamResult = await this.teamService.add({
                name: '默认小组',
                phone: '',
                note: '系统初始化默认小组',
                status: Status.Enable,
            }, bootstrapSession, tx);

            const adminSession = this.buildSystemSession(teamResult.data.id);
            await this.userService.add({
                account: '00010',
                userName: '管理员',
                checkerPassWord: '123456',
                reviewerPassWord: '123456',
                role: UserRole.Admin,
                teamId: teamResult.data.id,
                status: Status.Enable,
            }, adminSession, tx);
        });
        this.logger.log('没有用户，创建默认管理员用户 账号00010 用户名管理员 检验者密码123456 审核者密码123456');
    }
}
