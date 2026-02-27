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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const enums_1 = require("../common/enums/enums");
const hashPassword = (password) => {
    const hash = crypto.createHash('sha256');
    hash.update(password, 'utf8');
    return hash.digest('hex').toUpperCase();
};
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async add(dto) {
        const teamExists = await this.prisma.team.findFirst({ where: { id: dto.teamId } });
        if (!teamExists) {
            throw new common_1.HttpException('不存在的团队id', common_1.HttpStatus.FORBIDDEN);
        }
        const user = await this.prisma.user.create({
            data: {
                userName: dto.userName,
                passWord: hashPassword(dto.passWord),
                role: dto.role,
                teamId: dto.teamId,
            },
            include: { team: true },
        });
        return {
            success: true,
            data: {
                id: user.id,
                userName: user.userName,
                passWord: '*',
                role: user.role,
                status: user.status,
                teamId: user.teamId,
                teamName: user.team.name,
            },
        };
    }
    async show(dto) {
        const where = { status: { not: enums_1.Status.Delete } };
        if (dto.userName) {
            where.userName = { contains: dto.userName };
        }
        const page = dto.page || 1;
        const pageSize = dto.pageSize || 10;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { id: 'desc' },
                include: { team: true },
            }),
            this.prisma.user.count({ where }),
        ]);
        const totalPage = Math.ceil(total / pageSize);
        return {
            success: true,
            data: users.map(user => ({
                id: user.id,
                userName: user.userName,
                role: user.role,
                status: user.status,
                teamId: user.teamId,
                teamName: user.team.name,
            })),
            meta: { total, page, pageSize, totalPage },
        };
    }
    async update(dto) {
        const exists = await this.prisma.user.findFirst({ where: { id: dto.id } });
        if (!exists) {
            throw new common_1.HttpException('不存在的资源id', common_1.HttpStatus.FORBIDDEN);
        }
        const teamExists = await this.prisma.team.findFirst({ where: { id: dto.teamId } });
        if (!teamExists) {
            throw new common_1.HttpException('不存在的团队id', common_1.HttpStatus.FORBIDDEN);
        }
        const user = await this.prisma.user.update({
            where: { id: dto.id },
            data: {
                userName: dto.userName,
                passWord: hashPassword(dto.passWord),
                role: dto.role,
                status: dto.status,
                teamId: dto.teamId,
            },
            include: { team: true },
        });
        return {
            success: true,
            data: {
                id: user.id,
                userName: user.userName,
                passWord: '*',
                role: user.role,
                status: user.status,
                teamId: user.teamId,
                teamName: user.team.name,
            },
        };
    }
    async del(dto) {
        const exists = await this.prisma.user.findFirst({ where: { id: dto.id } });
        if (!exists) {
            throw new common_1.HttpException('不存在的资源id', common_1.HttpStatus.FORBIDDEN);
        }
        const user = await this.prisma.user.update({
            where: { id: dto.id },
            data: { status: enums_1.Status.Delete },
            include: { team: true },
        });
        return {
            success: true,
            data: {
                id: user.id,
                userName: user.userName,
                role: user.role,
                status: user.status,
                teamId: user.teamId,
                teamName: user.team.name,
            },
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map