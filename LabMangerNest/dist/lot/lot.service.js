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
exports.LotService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const enums_1 = require("../common/enums/enums");
const scope_util_1 = require("../common/utils/scope.util");
let LotService = class LotService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async add(dto, session) {
        const reagent = await this.prisma.reagent.findFirst({ where: { id: dto.reagentId } });
        if (!reagent) {
            throw new common_1.HttpException('不存在的试剂id', common_1.HttpStatus.FORBIDDEN);
        }
        const lot = await this.prisma.lot.create({
            data: {
                name: dto.name,
                reagentId: dto.reagentId,
                expirationDate: dto.expirationDate,
                teamId: reagent.teamId,
            },
            include: { reagent: { select: { id: true, name: true } } },
        });
        await this.prisma.inventory.create({
            data: {
                reagentId: lot.reagentId,
                lotId: lot.id,
                teamId: lot.teamId,
                number: 0,
            },
        });
        return {
            success: true,
            data: lot,
        };
    }
    async show(dto, session) {
        const where = { status: { not: enums_1.Status.Delete }, ...(0, scope_util_1.teamScope)(session) };
        if (dto.name) {
            where.name = { contains: dto.name };
        }
        const page = dto.page || 1;
        const pageSize = dto.pageSize || 10;
        const [lots, total] = await Promise.all([
            this.prisma.lot.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { id: 'desc' },
                include: { reagent: { select: { id: true, name: true } } },
            }),
            this.prisma.lot.count({ where }),
        ]);
        const totalPage = Math.ceil(total / pageSize);
        return {
            success: true,
            data: lots,
            meta: { total, page, pageSize, totalPage },
        };
    }
    async update(dto, session) {
        const exists = await this.prisma.lot.findFirst({ where: { id: dto.id, ...(0, scope_util_1.teamScope)(session) } });
        if (!exists) {
            throw new common_1.HttpException('不存在的资源id', common_1.HttpStatus.FORBIDDEN);
        }
        const reagent = await this.prisma.reagent.findFirst({ where: { id: dto.reagentId } });
        if (!reagent) {
            throw new common_1.HttpException('不存在的试剂id', common_1.HttpStatus.FORBIDDEN);
        }
        const lot = await this.prisma.lot.update({
            where: { id: dto.id },
            data: {
                name: dto.name,
                reagentId: dto.reagentId,
                expirationDate: dto.expirationDate,
                status: dto.status,
            },
            include: { reagent: { select: { id: true, name: true } } },
        });
        return {
            success: true,
            data: lot,
        };
    }
    async del(dto, session) {
        const exists = await this.prisma.lot.findFirst({ where: { id: dto.id, ...(0, scope_util_1.teamScope)(session) } });
        if (!exists) {
            throw new common_1.HttpException('不存在的资源id', common_1.HttpStatus.FORBIDDEN);
        }
        const lot = await this.prisma.lot.update({
            where: { id: dto.id },
            data: { status: enums_1.Status.Delete },
            include: { reagent: true },
        });
        await this.prisma.inventory.deleteMany({ where: { lotId: dto.id } });
        return {
            success: true,
            data: { ...lot, reagentName: lot.reagent.name },
        };
    }
    async showAll(dto, session) {
        const where = { status: enums_1.Status.Enable, ...(0, scope_util_1.teamScope)(session) };
        if (dto.reagentId) {
            where.reagentId = dto.reagentId;
        }
        const lots = await this.prisma.lot.findMany({
            where,
            select: { id: true, name: true },
            orderBy: { id: 'asc' },
        });
        return { success: true, data: lots };
    }
};
exports.LotService = LotService;
exports.LotService = LotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LotService);
//# sourceMappingURL=lot.service.js.map