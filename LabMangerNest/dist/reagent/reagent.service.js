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
exports.ReagentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const enums_1 = require("../common/enums/enums");
const scope_util_1 = require("../common/utils/scope.util");
let ReagentService = class ReagentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async add(dto, session) {
        const reagent = await this.prisma.reagent.create({
            data: {
                name: dto.name,
                specifications: dto.specifications,
                price: dto.price,
                storageCondition: dto.storageCondition,
                manufacturer: dto.manufacturer,
                note: dto.note,
                warnNumber: dto.warnNumber,
                warnDays: dto.warnDays,
                teamId: session.teamId,
            },
        });
        if (dto.generateLot) {
            const expirationDate = new Date();
            expirationDate.setMonth(expirationDate.getMonth() + 10);
            const lot = await this.prisma.lot.create({
                data: {
                    name: '默认' + reagent.name,
                    reagentId: reagent.id,
                    expirationDate,
                    teamId: reagent.teamId,
                },
            });
            await this.prisma.inventory.create({
                data: {
                    reagentId: reagent.id,
                    lotId: lot.id,
                    teamId: reagent.teamId,
                    number: 0,
                },
            });
        }
        return { success: true, data: reagent };
    }
    async show(dto, session) {
        const where = { status: { not: enums_1.Status.Delete }, ...(0, scope_util_1.teamScope)(session) };
        if (dto.name) {
            where.name = { contains: dto.name };
        }
        const page = dto.page || 1;
        const pageSize = dto.pageSize || 10;
        const [reagents, total] = await Promise.all([
            this.prisma.reagent.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { id: 'desc' },
            }),
            this.prisma.reagent.count({ where }),
        ]);
        const totalPage = Math.ceil(total / pageSize);
        return { success: true, data: reagents, meta: { total, page, pageSize, totalPage } };
    }
    async update(dto, session) {
        const exists = await this.prisma.reagent.findFirst({ where: { id: dto.id, ...(0, scope_util_1.teamScope)(session) } });
        if (!exists) {
            throw new common_1.HttpException('不存在的资源id', common_1.HttpStatus.FORBIDDEN);
        }
        const reagent = await this.prisma.reagent.update({
            where: { id: dto.id },
            data: {
                name: dto.name,
                specifications: dto.specifications,
                price: dto.price,
                storageCondition: dto.storageCondition,
                manufacturer: dto.manufacturer,
                note: dto.note,
                warnNumber: dto.warnNumber,
                warnDays: dto.warnDays,
                status: dto.status,
                teamId: session.teamId,
            },
        });
        return { success: true, data: reagent };
    }
    async del(dto, session) {
        const exists = await this.prisma.reagent.findFirst({ where: { id: dto.id, ...(0, scope_util_1.teamScope)(session) } });
        if (!exists) {
            throw new common_1.HttpException('不存在的资源id', common_1.HttpStatus.FORBIDDEN);
        }
        const reagent = await this.prisma.reagent.update({
            where: { id: dto.id },
            data: { status: enums_1.Status.Delete },
        });
        return { success: true, data: reagent };
    }
    async showAll(session) {
        const reagents = await this.prisma.reagent.findMany({
            where: { status: enums_1.Status.Enable, ...(0, scope_util_1.teamScope)(session) },
            select: { id: true, name: true },
            orderBy: { id: 'asc' },
        });
        return { success: true, data: reagents };
    }
};
exports.ReagentService = ReagentService;
exports.ReagentService = ReagentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReagentService);
//# sourceMappingURL=reagent.service.js.map