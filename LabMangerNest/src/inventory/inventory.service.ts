import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryDto } from './inventory.dto';
import { OperationAction } from '../common/enums/enums';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { teamScope } from '../common/utils/scope.util';

@Injectable()
export class InventoryService {
    constructor(private readonly prisma: PrismaService) { }

    private buildInventoryWhere(name: string | undefined, session: SessionUser) {
        const where: any = { ...teamScope(session) };
        if (name) { where.reagent = { name: { contains: name } }; }
        return where;
    }

    private mapInventory(inv: any) {
        const status = (inv.reagent.status !== 0 || inv.lot.status !== 0) ? 1 : 0;
        const warnings: string[] = [];
        if (inv.number <= inv.reagent.warnNumber) warnings.push('数量警告');
        if (inv.lot.expirationDate < new Date()) warnings.push('有效期警告');
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

    private readonly inventoryInclude = {
        reagent: { select: { id: true, name: true, specifications: true, warnNumber: true, status: true } },
        lot: { select: { id: true, name: true, expirationDate: true, status: true } },
    };

    async show(dto: InventoryDto['requestShow'], session: SessionUser): Promise<InventoryDto['responseShow']> {
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

    async showAll(dto: InventoryDto['requestShowAll'], session: SessionUser): Promise<InventoryDto['responseShowAll']> {
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

    async auditAll(session: SessionUser): Promise<InventoryDto['responseAuditAll']> {
        const scope = teamScope(session);
        const inventories = await this.prisma.inventory.findMany({ where: { ...scope } });

        await Promise.all(
            inventories.map(async inv => {
                const [inbound, outbound] = await Promise.all([
                    this.prisma.operation.count({
                        where: { reagentId: inv.reagentId, lotId: inv.lotId, action: OperationAction.Inbound },
                    }),
                    this.prisma.operation.count({
                        where: { reagentId: inv.reagentId, lotId: inv.lotId, action: OperationAction.Outbound },
                    }),
                ]);
                await this.prisma.inventory.update({
                    where: { id: inv.id },
                    data: { number: inbound - outbound },
                });
            }),
        );

        return { success: true, data: { message: '库存修正完成' } };
    }

    async statistics(dto: InventoryDto['requestStatistics'], session: SessionUser): Promise<InventoryDto['responseStatistics']> {
        const reagent = await this.prisma.reagent.findFirst({ where: { id: dto.reagentId, ...teamScope(session) } });
        if (!reagent) throw new HttpException('不存在的试剂id', HttpStatus.FORBIDDEN);
        const lot = await this.prisma.lot.findFirst({ where: { id: dto.lotId, ...teamScope(session) } });
        if (!lot) throw new HttpException('不存在的批号id', HttpStatus.FORBIDDEN);
        if (dto.startTime >= dto.endTime) {
            throw new HttpException('开始时间不能晚于结束时间', HttpStatus.FORBIDDEN);
        }

        const lotFilter = dto.onlyLot ? { lotId: dto.lotId } : {};

        const xAxisLabels: Date[] = [];
        const inventoryNumbers: number[] = [];
        const inboundNumbers: number[] = [];
        const outboundNumbers: number[] = [];

        let runningTotal = 0;
        let searchStart = new Date(dto.startTime);
        let searchEnd = new Date(searchStart);
        searchEnd.setDate(searchEnd.getDate() + dto.intervalDay);

        while (searchEnd <= dto.endTime) {
            const timeRange = { gte: searchStart, lt: searchEnd };

            const [inCount, outCount] = await Promise.all([
                this.prisma.operation.count({
                    where: { reagentId: dto.reagentId, ...lotFilter, action: OperationAction.Inbound, createTime: timeRange },
                }),
                this.prisma.operation.count({
                    where: { reagentId: dto.reagentId, ...lotFilter, action: OperationAction.Outbound, createTime: timeRange },
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
}
