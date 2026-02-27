"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var InitService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
let InitService = InitService_1 = class InitService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(InitService_1.name);
    }
    async onModuleInit() {
        await this.migrate_init();
    }
    async migrate_init() {
        this.logger.log('开始执行数据库迁移...');
        (0, child_process_1.execSync)('npx prisma migrate deploy', { stdio: 'inherit' });
        this.logger.log('数据库迁移完成，开始执行初始化检查...');
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
        const userCount = await this.prisma.user.count();
        if (userCount === 0) {
            const password = (0, crypto_1.createHash)('sha256')
                .update('123456', 'utf8')
                .digest('hex')
                .toUpperCase();
            await this.prisma.user.create({
                data: {
                    userName: 'admin',
                    passWord: password,
                    teamId: 1,
                    role: 3,
                },
            });
            this.logger.log('未检测到任何用户，创建一个默认用户账户:admin 密码:123456');
        }
    }
};
exports.InitService = InitService;
exports.InitService = InitService = InitService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InitService);
//# sourceMappingURL=init.service.js.map