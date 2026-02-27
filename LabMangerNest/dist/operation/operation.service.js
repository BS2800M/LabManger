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
exports.OperationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const enums_1 = require("../common/enums/enums");
const scope_util_1 = require("../common/utils/scope.util");
let OperationService = class OperationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateBarcode(id) {
        return (id + 100000).toString();
    }
    async updateInventory(reagentId, lotId, delta) {
        const inv = await this.prisma.inventory.findFirst({
            where: { reagentId, lotId },
            include: { reagent: true },
        });
        if (!inv)
            return { isSuccess: false, message: '库存记录不存在' };
        if (delta < 0 && inv.number + delta < 0) {
            return { isSuccess: false, message: `${inv.reagent.name}库存不足` };
        }
        const newNumber = inv.number + delta;
        await this.prisma.inventory.updateMany({
            where: { reagentId, lotId },
            data: { number: newNumber },
        });
        if (newNumber <= inv.reagent.warnNumber) {
            return { isSuccess: true, message: `${inv.reagent.name}库存达到警告线` };
        }
        return { isSuccess: true, message: `${inv.reagent.name}库存更新成功` };
    }
    async auditInventory(reagentId, lotId) {
        const [inboundCount, outboundCount] = await Promise.all([
            this.prisma.operation.count({
                where: { reagentId, lotId, action: enums_1.OperationAction.Inbound, status: { not: enums_1.Status.Delete } },
            }),
            this.prisma.operation.count({
                where: { reagentId, lotId, action: enums_1.OperationAction.Outbound, status: { not: enums_1.Status.Delete } },
            }),
        ]);
        await this.prisma.inventory.updateMany({
            where: { reagentId, lotId },
            data: { number: inboundCount - outboundCount },
        });
    }
    async inbound(dto, session) {
        const maxIdResult = await this.prisma.operation.aggregate({ _max: { id: true } });
        let currentId = (maxIdResult._max.id ?? 0) + 1;
        const operationsData = [];
        for (const item of dto.inboundList) {
            for (let i = 0; i < item.number; i++) {
                operationsData.push({
                    reagentId: item.reagentId,
                    lotId: item.lotId,
                    userId: session.userId,
                    teamId: session.teamId,
                    barcodeNumber: this.generateBarcode(currentId),
                    note: item.note,
                    action: enums_1.OperationAction.Inbound,
                    status: enums_1.Status.Enable,
                });
                currentId++;
            }
        }
        await this.prisma.operation.createMany({ data: operationsData });
        const inventoryResults = await Promise.all(dto.inboundList.map(item => this.updateInventory(item.reagentId, item.lotId, item.number)));
        return {
            success: true,
            data: { messages: inventoryResults.map(r => r.message) },
        };
    }
    async outbound(dto, session) {
        const [inboundCount, outboundCount] = await Promise.all([
            this.prisma.operation.count({
                where: { barcodeNumber: dto.barcodeNumber, action: enums_1.OperationAction.Inbound },
            }),
            this.prisma.operation.count({
                where: { barcodeNumber: dto.barcodeNumber, action: enums_1.OperationAction.Outbound },
            }),
        ]);
        if (inboundCount === 0 && outboundCount === 0) {
            return { success: true, data: { status: 1, message: '该条码未进行入库' } };
        }
        if (inboundCount === 1 && outboundCount === 1) {
            return { success: true, data: { status: 1, message: '该条码已经出库' } };
        }
        if (inboundCount === 1 && outboundCount === 0) {
            const origin = await this.prisma.operation.findFirst({
                where: { barcodeNumber: dto.barcodeNumber, action: enums_1.OperationAction.Inbound },
            });
            await this.prisma.operation.create({
                data: {
                    reagentId: origin.reagentId,
                    lotId: origin.lotId,
                    userId: session.userId,
                    teamId: origin.teamId,
                    barcodeNumber: origin.barcodeNumber,
                    note: origin.note,
                    action: enums_1.OperationAction.Outbound,
                    status: enums_1.Status.Enable,
                },
            });
            const result = await this.updateInventory(origin.reagentId, origin.lotId, -1);
            return { success: true, data: { status: 0, message: result.message } };
        }
        throw new common_1.HttpException('出库失败', common_1.HttpStatus.FORBIDDEN);
    }
    async specialOutbound(dto, session) {
        const inventoryResults = await Promise.all(dto.outboundList.map(item => this.updateInventory(item.reagentId, item.lotId, -(item.number))));
        const maxIdResult = await this.prisma.operation.aggregate({ _max: { id: true } });
        let currentId = (maxIdResult._max.id ?? 0) + 1;
        const validOperations = [];
        for (let i = 0; i < dto.outboundList.length; i++) {
            if (!inventoryResults[i].isSuccess)
                continue;
            const item = dto.outboundList[i];
            for (let j = 0; j < item.number; j++) {
                validOperations.push({
                    reagentId: item.reagentId,
                    lotId: item.lotId,
                    userId: session.userId,
                    teamId: session.teamId,
                    barcodeNumber: this.generateBarcode(currentId),
                    note: item.note,
                    action: enums_1.OperationAction.Outbound,
                    status: enums_1.Status.Enable,
                });
                currentId++;
            }
        }
        if (validOperations.length > 0) {
            await this.prisma.operation.createMany({ data: validOperations });
        }
        return {
            success: true,
            data: { messages: inventoryResults.map(r => r.message) },
        };
    }
    buildOperationQuery(dto, session) {
        const where = { status: { not: enums_1.Status.Delete }, ...(0, scope_util_1.teamScope)(session) };
        if (dto.reagentName) {
            where.reagent = { name: { contains: dto.reagentName } };
        }
        if (dto.barcodeNumber) {
            where.barcodeNumber = { contains: dto.barcodeNumber };
        }
        if (dto.startTime || dto.endTime) {
            where.createTime = {};
            if (dto.startTime)
                where.createTime.gte = dto.startTime;
            if (dto.endTime)
                where.createTime.lte = dto.endTime;
        }
        return where;
    }
    mapOperation(op) {
        return {
            id: op.id,
            createTime: op.createTime,
            reagent: { id: op.reagent.id, name: op.reagent.name },
            lot: { id: op.lot.id, name: op.lot.name },
            user: { id: op.user.id, userName: op.user.userName },
            note: op.note,
            barcodeNumber: op.barcodeNumber,
            action: op.action,
        };
    }
    async show(dto, session) {
        const where = this.buildOperationQuery(dto, session);
        const page = dto.page || 1;
        const pageSize = dto.pageSize || 10;
        const [operations, total] = await Promise.all([
            this.prisma.operation.findMany({
                where, skip: (page - 1) * pageSize, take: pageSize,
                orderBy: { id: 'desc' },
                include: { reagent: { select: { id: true, name: true } }, lot: { select: { id: true, name: true } }, user: { select: { id: true, userName: true } } },
            }),
            this.prisma.operation.count({ where }),
        ]);
        const totalPage = Math.ceil(total / pageSize);
        return { success: true, data: operations.map(op => this.mapOperation(op)), meta: { total, page, pageSize, totalPage } };
    }
    async showAll(dto, session) {
        const where = this.buildOperationQuery(dto, session);
        const page = dto.page || 1;
        const pageSize = dto.pageSize || 9999999;
        const [operations, total] = await Promise.all([
            this.prisma.operation.findMany({
                where, skip: (page - 1) * pageSize, take: pageSize,
                orderBy: { id: 'desc' },
                include: { reagent: { select: { id: true, name: true } }, lot: { select: { id: true, name: true } }, user: { select: { id: true, userName: true } } },
            }),
            this.prisma.operation.count({ where }),
        ]);
        const totalPage = Math.ceil(total / pageSize);
        return { success: true, data: operations.map(op => this.mapOperation(op)), meta: { total, page, pageSize, totalPage } };
    }
    async update(dto, session) {
        const exists = await this.prisma.operation.findFirst({ where: { id: dto.id, ...(0, scope_util_1.teamScope)(session) } });
        if (!exists)
            throw new common_1.HttpException('不存在的资源id', common_1.HttpStatus.FORBIDDEN);
        const reagentExists = await this.prisma.reagent.findFirst({ where: { id: dto.reagentId } });
        if (!reagentExists)
            throw new common_1.HttpException('不存在的试剂id', common_1.HttpStatus.FORBIDDEN);
        const lotExists = await this.prisma.lot.findFirst({ where: { id: dto.lotId } });
        if (!lotExists)
            throw new common_1.HttpException('不存在的批号id', common_1.HttpStatus.FORBIDDEN);
        const before = { reagentId: exists.reagentId, lotId: exists.lotId };
        const updated = await this.prisma.operation.update({
            where: { id: dto.id },
            data: {
                reagentId: dto.reagentId,
                lotId: dto.lotId,
                createTime: dto.createTime,
                action: dto.action,
                note: dto.note,
                barcodeNumber: dto.barcodeNumber,
            },
        });
        await this.auditInventory(before.reagentId, before.lotId);
        if (before.reagentId !== dto.reagentId || before.lotId !== dto.lotId) {
            await this.auditInventory(dto.reagentId, dto.lotId);
        }
        return { success: true, data: updated };
    }
    async del(dto, session) {
        const exists = await this.prisma.operation.findFirst({ where: { id: dto.id, ...(0, scope_util_1.teamScope)(session) } });
        if (!exists)
            throw new common_1.HttpException('不存在的资源id', common_1.HttpStatus.FORBIDDEN);
        const deleted = await this.prisma.operation.update({
            where: { id: dto.id },
            data: { status: enums_1.Status.Delete },
        });
        await this.auditInventory(deleted.reagentId, deleted.lotId);
        return { success: true, data: deleted };
    }
};
exports.OperationService = OperationService;
exports.OperationService = OperationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OperationService);
//# sourceMappingURL=operation.service.js.map