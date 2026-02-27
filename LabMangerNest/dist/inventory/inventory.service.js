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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const enums_1 = require("../common/enums/enums");
const scope_util_1 = require("../common/utils/scope.util");
let InventoryService = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
        this.inventoryInclude = {
            reagent: { select: { id: true, name: true, specifications: true, warnNumber: true, status: true } },
            lot: { select: { id: true, name: true, expirationDate: true, status: true } },
        };
    }
    buildInventoryWhere(name, session) {
        const where = { ...(0, scope_util_1.teamScope)(session) };
        if (name) {
            where.reagent = { name: { contains: name } };
        }
        return where;
    }
    mapInventory(inv) {
        const status = (inv.reagent.status !== 0 || inv.lot.status !== 0) ? 1 : 0;
        const warnings = [];
        if (inv.number <= inv.reagent.warnNumber)
            warnings.push('数量警告');
        if (inv.lot.expirationDate < new Date())
            warnings.push('有效期警告');
        return {
            id: inv.id,
            reagent: { id: inv.reagent.id, name: inv.reagent.name, specifications: inv.reagent.specifications, warnNumber: inv.reagent.warnNumber },
            lot: { id: inv.lot.id, name: inv.lot.name, expirationDate: inv.lot.expirationDate },
            teamId: inv.teamId,
            number: inv.number,
            status,
            warning: warnings.join('，'),
        };
    }
    async show(dto, session) {
        const where = this.buildInventoryWhere(dto.name, session);
        const page = dto.page || 1;
        const pageSize = dto.pageSize || 10;
        const [inventories, total] = await Promise.all([
            this.prisma.inventory.findMany({
                where, skip: (page - 1) * pageSize, take: pageSize,
                orderBy: { id: 'desc' }, include: this.inventoryInclude,
            }),
            this.prisma.inventory.count({ where }),
        ]);
        const totalPage = Math.ceil(total / pageSize);
        return {
            success: true,
            data: inventories.map(inv => {
                return this.mapInventory(inv);
            }),
            meta: { total, page, pageSize, totalPage },
        };
    }
    async showAll(dto, session) {
        const where = this.buildInventoryWhere(dto.name, session);
        const page = dto.page || 1;
        const pageSize = dto.pageSize || 9999999;
        const [inventories, total] = await Promise.all([
            this.prisma.inventory.findMany({
                where, skip: (page - 1) * pageSize, take: pageSize,
                orderBy: { id: 'desc' }, include: this.inventoryInclude,
            }),
            this.prisma.inventory.count({ where }),
        ]);
        const totalPage = Math.ceil(total / pageSize);
        return {
            success: true,
            data: inventories.map(inv => this.mapInventory(inv)),
            meta: { total, page, pageSize, totalPage },
        };
    }
    async auditAll(session) {
        const scope = (0, scope_util_1.teamScope)(session);
        const inventories = await this.prisma.inventory.findMany({ where: { ...scope } });
        await Promise.all(inventories.map(async (inv) => {
            const [inbound, outbound] = await Promise.all([
                this.prisma.operation.count({
                    where: { reagentId: inv.reagentId, lotId: inv.lotId, action: enums_1.OperationAction.Inbound },
                }),
                this.prisma.operation.count({
                    where: { reagentId: inv.reagentId, lotId: inv.lotId, action: enums_1.OperationAction.Outbound },
                }),
            ]);
            await this.prisma.inventory.update({
                where: { id: inv.id },
                data: { number: inbound - outbound },
            });
        }));
        return { success: true, data: { message: '库存修正完成' } };
    }
    async statistics(dto, session) {
        const reagent = await this.prisma.reagent.findFirst({ where: { id: dto.reagentId, ...(0, scope_util_1.teamScope)(session) } });
        if (!reagent)
            throw new common_1.HttpException('不存在的试剂id', common_1.HttpStatus.FORBIDDEN);
        const lot = await this.prisma.lot.findFirst({ where: { id: dto.lotId, ...(0, scope_util_1.teamScope)(session) } });
        if (!lot)
            throw new common_1.HttpException('不存在的批号id', common_1.HttpStatus.FORBIDDEN);
        if (dto.startTime >= dto.endTime) {
            throw new common_1.HttpException('开始时间不能晚于结束时间', common_1.HttpStatus.FORBIDDEN);
        }
        const lotFilter = dto.onlyLot ? { lotId: dto.lotId } : {};
        const xAxisLabels = [];
        const inventoryNumbers = [];
        const inboundNumbers = [];
        const outboundNumbers = [];
        let runningTotal = 0;
        let searchStart = new Date(dto.startTime);
        let searchEnd = new Date(searchStart);
        searchEnd.setDate(searchEnd.getDate() + dto.intervalDay);
        while (searchEnd <= dto.endTime) {
            const timeRange = { gte: searchStart, lt: searchEnd };
            const [inCount, outCount] = await Promise.all([
                this.prisma.operation.count({
                    where: { reagentId: dto.reagentId, ...lotFilter, action: enums_1.OperationAction.Inbound, createTime: timeRange },
                }),
                this.prisma.operation.count({
                    where: { reagentId: dto.reagentId, ...lotFilter, action: enums_1.OperationAction.Outbound, createTime: timeRange },
                }),
            ]);
            runningTotal += inCount - outCount;
            xAxisLabels.push(new Date(searchStart));
            inventoryNumbers.push(runningTotal);
            inboundNumbers.push(inCount);
            outboundNumbers.push(outCount);
            searchStart = new Date(searchEnd);
            searchEnd = new Date(searchStart);
            searchEnd.setDate(searchEnd.getDate() + dto.intervalDay);
        }
        return {
            success: true,
            data: {
                xAxisLabels,
                dataSet: [
                    { name: '库存', number: inventoryNumbers },
                    { name: '入库', number: inboundNumbers },
                    { name: '出库', number: outboundNumbers },
                ],
            },
        };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map