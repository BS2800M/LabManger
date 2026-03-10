import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryDto } from './inventory.dto';
import { OperationAction } from '../common/enums/enums';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { teamScope } from '../common/utils/scope.util';
import { Status } from '../common/enums/enums';
@Injectable()
export class InventoryService {
    constructor(private readonly prisma: PrismaService) { }

    private buildInventoryWhere(name: string | undefined, session: SessionUser) {
        const where: any = { ...teamScope(session) };
        if (name) { where.reagent = { name: { contains: name } }; }
        return where;
    }



    // 更新指定批号数量（可选）并检查该试剂所有批号总数与预警数量，更新 warningNum 状态
    // lotId + delta 不传或 delta=0 时只做警告检查（如修改试剂信息后调用）
    public async updateInventory(
        reagentId: number,
        delta: number,
        lotId?: number,
    ): Promise<{ isSuccess: boolean; message: string }> {
        const reagent = await this.prisma.reagent.findFirst({
            where: { id: reagentId },
            select: { name: true, warnNumber: true },
        });
        if (!reagent) return { isSuccess: false, message: '试剂不存在' };

        if (lotId !== undefined && delta !== 0) {
            const inv = await this.prisma.inventory.findFirst({ where: { reagentId, lotId } });
            if (!inv) return { isSuccess: false, message: '库存记录不存在' };

            if (delta < 0 && inv.number + delta < 0) {
                return { isSuccess: false, message: `${reagent.name}库存不足` };
            }

            await this.prisma.inventory.updateMany({
                where: { reagentId, lotId },
                data: { number: { increment: delta } },
            });
        }

        const total = (await this.prisma.inventory.aggregate({
            where: { reagentId },
            _sum: { number: true },
        }))._sum.number ?? 0;

        const isWarning = total <= reagent.warnNumber;
        await this.prisma.inventory.updateMany({
            where: { reagentId },
            data: { warningNum: isWarning },
        });

        if (!isWarning) return { isSuccess: true, message: `${reagent.name}库存更新成功` };
        return { isSuccess: true, message: `${reagent.name}库存达到警告线` };
    }

    // 检查库存的有效期预警：expirationDate <= 今天 + warnDays → warningExpirationDate = true
    // lotId 不传 → 检查所有库存；传 lotId → 只检查该批号的库存
    public async updateExpirationWarning(lotId?: number): Promise<void> {
        const inventories = await this.prisma.inventory.findMany({
            where: lotId !== undefined ? { lotId } : {},
            include: {
                lot: { select: { expirationDate: true } },
                reagent: { select: { warnDays: true } },
            },
        });

        const trueIds: number[] = [];
        const falseIds: number[] = [];

        for (const inv of inventories) {
            const threshold = new Date();
            threshold.setDate(threshold.getDate() + inv.reagent.warnDays);
            if (inv.lot.expirationDate <= threshold) {
                trueIds.push(inv.id);
            } else {
                falseIds.push(inv.id);
            }
        }

        await Promise.all([
            trueIds.length > 0 && this.prisma.inventory.updateMany({
                where: { id: { in: trueIds } },
                data: { warningExpirationDate: true },
            }),
            falseIds.length > 0 && this.prisma.inventory.updateMany({
                where: { id: { in: falseIds } },
                data: { warningExpirationDate: false },
            }),
        ]);
    }

    async show(dto: InventoryDto['requestShow'], session: SessionUser): Promise<InventoryDto['responseShow']> {
        const where = this.buildInventoryWhere(dto.name, session);
        const page = dto.page || 1;
        const pageSize = dto.pageSize || 10;

        let [inventories, total] = await Promise.all([
            this.prisma.inventory.findMany({
                where, skip: (page - 1) * pageSize, take: pageSize,
                orderBy: [{ warningNum: 'desc' }, { warningExpirationDate: 'desc' }], 
                include: { reagent: { select: { id: true, name: true, specifications: true, warnNumber: true, status: true } }, 
                           lot: { select: { id: true, name: true, expirationDate: true, status: true } } },
            }),
            this.prisma.inventory.count({ where }),
        ]);

        const totalPage = Math.ceil(total / pageSize);
        const inventoriesToReturn = inventories.map(inv => {
            const status = (inv.reagent.status !== 0 || inv.lot.status !== 0) ? 1 : 0;
            return { ...inv, status };
        });
        return { success: true, data: inventoriesToReturn, meta: { total, page, pageSize, totalPage } };
    }

    async showAll(dto: InventoryDto['requestShowAll'], session: SessionUser): Promise<InventoryDto['responseShowAll']> {
        const where = this.buildInventoryWhere(dto.name, session);
        const page = dto.page || 1;
        const pageSize = dto.pageSize || 9999999;

        const [inventories, total] = await Promise.all([
            this.prisma.inventory.findMany({
                where, skip: (page - 1) * pageSize, take: pageSize,
                orderBy: { id: 'desc' }, 
                include: { reagent: { select: { id: true, name: true, specifications: true, warnNumber: true, status: true } }, 
                           lot: { select: { id: true, name: true, expirationDate: true, status: true } } },
            }),
            this.prisma.inventory.count({ where }),
        ]);

        const totalPage = Math.ceil(total / pageSize);
        const inventoriesToReturn = inventories.map(inv => {
            const status = (inv.reagent.status !== 0 || inv.lot.status !== 0) ? 1 : 0;
            return { ...inv, status };
        });
        return {
            success: true,
            data: inventoriesToReturn,
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
