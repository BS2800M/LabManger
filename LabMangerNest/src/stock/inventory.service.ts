import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MangerPrismaService } from '../prisma/manger-prisma.service';
import { InventoryDto } from './inventory.dto';
import { OperationAction } from '../common/enums/enums';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { Status } from '../common/enums/enums';
import type { Prisma } from '../../generated/prisma-manger/client';
@Injectable()
export class InventoryService {
    constructor(private readonly prisma: MangerPrismaService) { }

    // 内部方法：向库存表新增一行（无需单独路由）
    public async add(params: {
        reagentId: number;
        lotId: number;
        teamId: number;
        number?: number;
    }, tx: Prisma.TransactionClient): Promise<void> {
        await this.addWithDb(params, tx);
    }

    private async addWithDb(params: {
        reagentId: number;
        lotId: number;
        teamId: number;
        number?: number;
    }, db: Prisma.TransactionClient): Promise<void> {
        const { reagentId, lotId, teamId, number = 0 } = params;
        let targetInventoryId: number | null = null;

        const lot = await db.lot.findFirst({
            where: { id: lotId },
            select: { id: true, reagentId: true },
        });
        if (!lot) {
            throw new HttpException('不存在的批号id', HttpStatus.FORBIDDEN);
        }
        if (lot.reagentId !== reagentId) {
            throw new HttpException('批号不属于该试剂', HttpStatus.FORBIDDEN);
        }

        const exists = await db.inventory.findFirst({
            where: { reagentId, lotId },
            select: { id: true, status: true },
        });
        if (exists && exists.status !== Status.Delete) {
            throw new HttpException('库存记录已存在', HttpStatus.FORBIDDEN);
        }
        if (exists && exists.status === Status.Delete) {
            await db.inventory.update({
                where: { id: exists.id },
                data: {
                    teamId,
                    number,
                    status: Status.Enable,
                    warningNum: false,
                    warningExpirationDate: false,
                },
            });
            targetInventoryId = exists.id;
        } else {
            const created = await db.inventory.create({
                data: {
                    reagentId,
                    lotId,
                    teamId,
                    number,
                    status: Status.Enable,
                },
            });
            targetInventoryId = created.id;
        }
        
        // 按 inventory id 重算库存数量（number）
        if (targetInventoryId != null) {
            await this.recalculateInventoryNumbersByInventoryIds([targetInventoryId], db);
        }

        // 新增库存后，立即刷新数量预警与有效期预警
        await Promise.all([
            this.updateInventory(reagentId, 0, lotId, db),
            this.updateExpirationWarning(lotId, db),
        ]);

    }

    // 内部方法：更新库存表一行（无需单独路由）
    // 逻辑与 add 一致，仅多了目标 id
    public async update(params: {
        id: number;
        reagentId: number;
        lotId: number;
        teamId: number;
        number?: number;
    }, tx: Prisma.TransactionClient): Promise<void> {
        await this.updateWithDb(params, tx);
    }

    private async updateWithDb(params: {
        id: number;
        reagentId: number;
        lotId: number;
        teamId: number;
        number?: number;
    }, db: Prisma.TransactionClient): Promise<void> {
        const { id, reagentId, lotId, teamId, number = 0 } = params;

        const exists = await db.inventory.findFirst({
            where: { id, status: { not: Status.Delete } },
            select: { id: true, reagentId: true, lotId: true },
        });
        if (!exists) {
            throw new HttpException('不存在的库存记录', HttpStatus.FORBIDDEN);
        }

        const lot = await db.lot.findFirst({
            where: { id: lotId },
            select: { id: true, reagentId: true },
        });
        if (!lot) {
            throw new HttpException('不存在的批号id', HttpStatus.FORBIDDEN);
        }
        if (lot.reagentId !== reagentId) {
            throw new HttpException('批号不属于该试剂', HttpStatus.FORBIDDEN);
        }

        const duplicate = await db.inventory.findFirst({
            where: {
                id: { not: id },
                reagentId,
                lotId,
                status: { not: Status.Delete },
            },
            select: { id: true },
        });
        if (duplicate) {
            throw new HttpException('库存记录已存在', HttpStatus.FORBIDDEN);
        }

        await db.inventory.update({
            where: { id },
            data: {
                reagentId,
                lotId,
                teamId,
                number,
            },
        });

        const affectedReagentIds = [...new Set([exists.reagentId, reagentId])];
        const affectedLotIds = [...new Set([exists.lotId, lotId])];

        // 按 inventory id 重算库存数量（number）
        await this.recalculateInventoryNumbersByInventoryIds([id], db);
        // 更新后刷新数量预警与有效期预警
        await Promise.all([
            ...affectedReagentIds.map((rid) => this.updateInventory(rid, 0, undefined, db)),
            ...affectedLotIds.map((lid) => this.updateExpirationWarning(lid, db)),
        ]);


    }

    private buildInventoryWhere(name: string | undefined, session: SessionUser) {
        const and: any[] = [];

        and.push({ status: { not: Status.Delete } });
        // 仅展示试剂/批号都不是删除的库存（覆盖：都启用 或 至少一个停用）
        and.push({ reagent: { status: { not: Status.Delete } } });
        and.push({ lot: { status: { not: Status.Delete } } });

        if (name) {
            and.push({ reagent: { name: { contains: name } } });
        }
        return { AND: and };
    }

    // 库存状态聚合规则：
    // 任一端删除 -> 删除；否则任一端停用 -> 停用；否则启用
    private resolveInventoryStatus(reagentStatus: number, lotStatus: number): number {
        if (reagentStatus === Status.Delete || lotStatus === Status.Delete) return Status.Delete;
        if (reagentStatus === Status.Disable || lotStatus === Status.Disable) return Status.Disable;
        return Status.Enable;
    }



    // 更新指定批号库存（可选），并统一刷新该试剂的预警状态
    // 当 lotId 不传或 delta=0 时，仅执行预警检查
    public async updateInventory(
        reagentId: number,
        delta: number,
        lotId: number | undefined,
        tx: Prisma.TransactionClient,
    ): Promise<{ isSuccess: boolean; message: string }> {
        const reagent = await tx.reagent.findFirst({
            where: { id: reagentId },
            select: { name: true, warnNumber: true },
        });
        if (!reagent) return { isSuccess: false, message: '试剂不存在' }; 

        if (lotId !== undefined && delta !== 0) {
            const inv = await tx.inventory.findFirst({ where: { reagentId, lotId, status: { not: Status.Delete } } });
            if (!inv) return { isSuccess: false, message: '库存记录不存在' }; 

            if (delta < 0 && inv.number + delta < 0) {
                return { isSuccess: false, message: `${reagent.name}库存不足` };
            }

            await tx.inventory.updateMany({
                where: { reagentId, lotId, status: { not: Status.Delete } },
                data: { number: { increment: delta } },
            });
        }

        const total = (await tx.inventory.aggregate({
            where: { reagentId, status: { not: Status.Delete } },
            _sum: { number: true },
        }))._sum.number ?? 0;

        const isWarning = total <= reagent.warnNumber;
        await tx.inventory.updateMany({
            where: { reagentId, status: { not: Status.Delete } },
            data: { warningNum: isWarning },
        });

        if (!isWarning) return { isSuccess: true, message: `${reagent.name}库存更新成功` };
        return { isSuccess: true, message: `${reagent.name}库存达到警告线` };
    }

    // 检查有效期预警：expirationDate <= 今天 + warnDays 时置 warningExpirationDate=true
    // 不传 lotId 则检查全部库存，传 lotId 则仅检查该批号
    public async updateExpirationWarning(lotId: number | undefined, tx: Prisma.TransactionClient): Promise<void> {
        const inventories = await tx.inventory.findMany({
            where: lotId !== undefined
                ? { lotId, status: { not: Status.Delete } }
                : { status: { not: Status.Delete } },
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
            trueIds.length > 0 && tx.inventory.updateMany({
                where: { id: { in: trueIds } },
                data: { warningExpirationDate: true },
            }),
            falseIds.length > 0 && tx.inventory.updateMany({
                where: { id: { in: falseIds } },
                data: { warningExpirationDate: false },
            }),
        ]);
    }

    // 按 inventory id 重算库存数量（number），基于操作历史记录计算
    public async recalculateInventoryNumbersByInventoryIds(
        inventoryIds: number[],
        tx: Prisma.TransactionClient,
    ): Promise<void> {
        const uniqueIds = [...new Set(inventoryIds.filter((id) => Number.isInteger(id) && id > 0))];
        if (uniqueIds.length === 0) return;

        const inventories = await tx.inventory.findMany({
            where: { id: { in: uniqueIds }, status: { not: Status.Delete } },
            select: { id: true, reagentId: true, lotId: true },
        });

        await Promise.all(
            inventories.map(async (inv) => {
                const [inbound, outbound] = await Promise.all([
                    tx.operation.count({
                        where: {
                            reagentId: inv.reagentId,
                            lotId: inv.lotId,
                            action: OperationAction.Inbound,
                            status: Status.Enable,
                        },
                    }),
                    tx.operation.count({
                        where: {
                            reagentId: inv.reagentId,
                            lotId: inv.lotId,
                            action: OperationAction.Outbound,
                            status: Status.Enable,
                        },
                    }),
                ]);

                await tx.inventory.update({
                    where: { id: inv.id },
                    data: { number: inbound - outbound },
                });
            }),
        );
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
        const status = this.resolveInventoryStatus(inv.reagent.status, inv.lot.status);
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
            const status = this.resolveInventoryStatus(inv.reagent.status, inv.lot.status);
            return { ...inv, status };
        });
        return {
            success: true,
            data: inventoriesToReturn,
            meta: { total, page, pageSize, totalPage },
        };
    }

    async auditAll(session: SessionUser, tx: Prisma.TransactionClient): Promise<InventoryDto['responseAuditAll']> {
        const inventories = await tx.inventory.findMany({
            where: { status: { not: Status.Delete } },
        });

        await Promise.all(
            inventories.map(async inv => {
                const [inbound, outbound] = await Promise.all([
                    tx.operation.count({
                        where: { reagentId: inv.reagentId, lotId: inv.lotId, action: OperationAction.Inbound ,status: Status.Enable},
                    }),
                    tx.operation.count({
                        where: { reagentId: inv.reagentId, lotId: inv.lotId, action: OperationAction.Outbound ,status: Status.Enable},
                    }),
                ]);
                await tx.inventory.update({
                    where: { id: inv.id },
                    data: { number: inbound - outbound },
                });
            }),
        );

        return { success: true, data: { message: '库存修正完成' } };
    }

    async statistics(dto: InventoryDto['requestStatistics'], session: SessionUser): Promise<InventoryDto['responseStatistics']> {
        const reagent = await this.prisma.reagent.findFirst({ where: { id: dto.reagentId } });
        if (!reagent) throw new HttpException('不存在的试剂id', HttpStatus.FORBIDDEN);
        const lot = await this.prisma.lot.findFirst({ where: { id: dto.lotId } });
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
