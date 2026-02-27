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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = require("crypto");
const hashPassword = (password) => {
    const hash = crypto.createHash('sha256');
    hash.update(password, 'utf8');
    return hash.digest('hex').toUpperCase();
};
let AuthService = class AuthService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async signin(dto) {
        const { userName, passWord } = dto;
        const hashedPwd = hashPassword(passWord ?? '');
        const user = await this.prisma.user.findFirst({
            where: { userName, passWord: hashedPwd },
            include: { team: true },
        });
        if (!user) {
            throw new common_1.HttpException('用户名或密码错误', common_1.HttpStatus.FORBIDDEN);
        }
        const sessionId = crypto.randomUUID().replace(/-/g, '');
        await this.prisma.session.create({
            data: {
                sessionId,
                userId: user.id,
                teamId: user.teamId,
                role: user.role,
            },
        });
        return {
            success: true,
            data: {
                sessionId,
                userName: user.userName,
                teamName: user.team.name,
                role: user.role,
            },
        };
    }
    async signout(dto) {
        if (dto.sessionId) {
            await this.prisma.session.deleteMany({
                where: { sessionId: dto.sessionId },
            });
        }
        return { success: true, data: { status: 0 } };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map