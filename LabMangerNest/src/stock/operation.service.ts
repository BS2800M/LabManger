import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MangerPrismaService } from '../prisma/manger-prisma.service';
import { OperationDto } from './operation.dto';
import { Status, OperationAction } from '../common/enums/enums';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { teamScope } from '../common/utils/scope.util';
import { InventoryService } from './inventory.service';
import { UserPrismaService } from '../prisma/user-prisma.service';
import type { Prisma } from '../../generated/prisma-manger/client';

type OperationQueryFilters = Pick<OperationDto['requestShow'], 'reagentName' | 'barcodeNumber' | 'startTime' | 'endTime'>;

const operationListInclude = {
    reagent: { select: { id: true, name: true } },
    lot: { select: { id: true, name: true } },
} as const;

type OperationListRecord = Prisma.OperationGetPayload<{ include: typeof operationListInclude }>;
type GroupedOperationRow = OperationDto['responseShow']['data'][number];

@Injectable()
export class OperationService {
    constructor(
        private readonly prisma: MangerPrismaService,
        private readonly userPrisma: UserPrismaService,
        private readonly inventoryService: InventoryService,
    ) { }

    /**
     * 批量加载用户 ID -> 用户名映射，用于列表展示时补全用户名。
     */
    private async loadUserMap(userIds: number[]): Promise<Map<number, string>> {
        if (userIds.length === 0) return new Map();
        const users = await this.userPrisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, userName: true },
        });
        return new Map(users.map((user) => [user.id, user.userName]));
    }

    private async loadReagentMap(reagentIds: number[]): Promise<Map<number, string>> {
        if (reagentIds.length === 0) return new Map();
        const reagents = await this.prisma.reagent.findMany({
            where: { id: { in: reagentIds } },
            select: { id: true, name: true },
        });
        return new Map(reagents.map((reagent) => [reagent.id, reagent.name]));
    }

    private async loadLotMap(lotIds: number[]): Promise<Map<number, string>> {
        if (lotIds.length === 0) return new Map();
        const lots = await this.prisma.lot.findMany({
            where: { id: { in: lotIds } },
            select: { id: true, name: true },
        });
        return new Map(lots.map((lot) => [lot.id, lot.name]));
    }

    private async loadUserName(userId: number): Promise<string> {
        const userMap = await this.loadUserMap([userId]);
        return userMap.get(userId) ?? '';
    }

 

    /**
     * 预留一段连续条码号区间，返回本次区间起始值。
     */
    private async reserveBarcodeRange(count: number): Promise<bigint> {
        const row = await this.prisma.barcodeCounter.upsert({
            where: { id: 1 },
            create: { id: 1, value: count },
            update: { value: { increment: count } },
        });
        return row.value - BigInt(count);
    }

    /**
     * 将数值条码编码为固定长度字符串（36 进制、8 位、不足补 0）。
     */
    private encodeBarcode(n: bigint): string {
        return n.toString(36).toUpperCase().padStart(8, '0');
    }

    /**
     * 入库操作：
     * 1. 按入库明细生成 operation 记录；
     * 2. 批量更新库存；
     * 3. 返回每条库存更新结果信息。
     */
    async inbound(dto: OperationDto['requestInbound'], session: SessionUser): Promise<OperationDto['responseInbound']> {
        const totalCount = dto.inboundList.reduce((sum, item) => sum + item.number, 0);
        const startId = await this.reserveBarcodeRange(totalCount);
        const reagentIds = [...new Set(dto.inboundList.map((item) => item.reagentId))];
        const lotIds = [...new Set(dto.inboundList.map((item) => item.lotId))];
        const [reagentMap, lotMap, userName] = await Promise.all([
            this.loadReagentMap(reagentIds),
            this.loadLotMap(lotIds),
            this.loadUserName(session.userId),
        ]);

        const operationsData: Prisma.OperationCreateManyInput[] = [];
        let offset = 0;
        for (const item of dto.inboundList) {
            const groupId = randomUUID();
            for (let i = 0; i < item.number; i++) {
                operationsData.push({
                    reagentId: item.reagentId,
                    lotId: item.lotId,
                    userId: session.userId,
                    teamId: session.teamId,
                    groupId,
                    barcodeNumber: this.encodeBarcode(startId + BigInt(offset++)),
                    note: item.note,
                    action: OperationAction.Inbound,
                    status: Status.Enable,
                    userNameSnapshot: userName,
                    reagentNameSnapshot: reagentMap.get(item.reagentId) ?? '',
                    lotNameSnapshot: lotMap.get(item.lotId) ?? '',
                });
            }
        }

        await this.prisma.operation.createMany({ data: operationsData });

        const inventoryResults = await Promise.all(
            dto.inboundList.map((item) => this.inventoryService.updateInventory(item.reagentId, item.number, item.lotId)),
        );

        return {
            success: true,
            data: { messages: inventoryResults.map((r) => r.message) },
        };
    }

    /**
     * 普通出库（按条码）：
     * - 校验条码是否已入库、是否已出库；
     * - 未出库时创建出库记录并扣减库存；
     * - 返回处理状态与消息。
     */
    async outbound(dto: OperationDto['requestOutbound'], session: SessionUser): Promise<OperationDto['responseOutbound']> {
        const [inboundCount, outboundCount] = await Promise.all([
            this.prisma.operation.count({
                where: {
                    barcodeNumber: dto.barcodeNumber,
                    action: OperationAction.Inbound,
                    status: { not: Status.Delete },
                    ...teamScope(session),
                },
            }),
            this.prisma.operation.count({
                where: {
                    barcodeNumber: dto.barcodeNumber,
                    action: OperationAction.Outbound,
                    status: { not: Status.Delete },
                    ...teamScope(session),
                },
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
                where: {
                    barcodeNumber: dto.barcodeNumber,
                    action: OperationAction.Inbound,
                    status: { not: Status.Delete },
                    ...teamScope(session),
                },
                include: {
                    reagent: { select: { name: true } },
                    lot: { select: { name: true } },
                },
            });
            if (!origin) {
                return { success: true, data: { status: 1, message: '该条码未入库' } };
            }

            const userName = await this.loadUserName(session.userId);

            await this.prisma.operation.create({
                data: {
                    reagentId: origin.reagentId,
                    lotId: origin.lotId,
                    userId: session.userId,
                    teamId: origin.teamId,
                    groupId: randomUUID(),
                    barcodeNumber: origin.barcodeNumber,
                    note: origin.note,
                    action: OperationAction.Outbound,
                    status: Status.Enable,
                    userNameSnapshot: userName,
                    reagentNameSnapshot: origin.reagentNameSnapshot || origin.reagent.name,
                    lotNameSnapshot: origin.lotNameSnapshot || origin.lot.name,
                },
            });

            const result = await this.inventoryService.updateInventory(origin.reagentId, -1, origin.lotId);
            return { success: true, data: { status: 0, message: result.message } };
        }

        throw new HttpException('outbound failed', HttpStatus.FORBIDDEN);
    }

    /**
     * 特殊出库（无原始入库条码或批量场景）：
     * 先逐条尝试扣减库存，仅为成功项生成出库操作记录并分配新条码。
     */
    async specialOutbound(dto: OperationDto['requestSpecialOutbound'], session: SessionUser): Promise<OperationDto['responseSpecialOutbound']> {
        const reagentIds = [...new Set(dto.outboundList.map((item) => item.reagentId))];
        const lotIds = [...new Set(dto.outboundList.map((item) => item.lotId))];
        const [reagentMap, lotMap, userName] = await Promise.all([
            this.loadReagentMap(reagentIds),
            this.loadLotMap(lotIds),
            this.loadUserName(session.userId),
        ]);

        const inventoryResults = await Promise.all(
            dto.outboundList.map((item) => this.inventoryService.updateInventory(item.reagentId, -item.number, item.lotId)),
        );

        const validCount = dto.outboundList.reduce((sum, item, i) => sum + (inventoryResults[i].isSuccess ? item.number : 0), 0);

        const validOperations: Prisma.OperationCreateManyInput[] = [];
        if (validCount > 0) {
            const startId = await this.reserveBarcodeRange(validCount);
            let offset = 0;
            for (let i = 0; i < dto.outboundList.length; i++) {
                if (!inventoryResults[i].isSuccess) continue;
                const item = dto.outboundList[i];
                const groupId = randomUUID();
                for (let j = 0; j < item.number; j++) {
                    validOperations.push({
                        reagentId: item.reagentId,
                        lotId: item.lotId,
                        userId: session.userId,
                        teamId: session.teamId,
                        groupId,
                        barcodeNumber: this.encodeBarcode(startId + BigInt(offset++)),
                        note: item.note,
                        action: OperationAction.Outbound,
                        status: Status.Enable,
                        userNameSnapshot: userName,
                        reagentNameSnapshot: reagentMap.get(item.reagentId) ?? '',
                        lotNameSnapshot: lotMap.get(item.lotId) ?? '',
                    });
                }
            }
            await this.prisma.operation.createMany({ data: validOperations });
        }

        return {
            success: true,
            data: { messages: inventoryResults.map((r) => r.message) },
        };
    }

    /**
     * 构建操作记录查询条件（团队隔离 + 状态过滤 + 名称/条码/时间范围）。
     */
    private buildOperationQuery(dto: OperationQueryFilters, session: SessionUser): Prisma.OperationWhereInput {
        const where: Prisma.OperationWhereInput = { status: { not: Status.Delete }, ...teamScope(session) };
        if (dto.reagentName) { where.reagent = { name: { contains: dto.reagentName } }; }
        if (dto.barcodeNumber) { where.barcodeNumber = { contains: dto.barcodeNumber }; }
        if (dto.startTime || dto.endTime) {
            where.createTime = {};
            if (dto.startTime) where.createTime.gte = dto.startTime;
            if (dto.endTime) where.createTime.lte = dto.endTime;
        }
        return where;
    }

    /**
     * 在数据库按 groupId 分组分页，并查询当前页分组明细，最终组装为接口行结构。
     */
    private async queryGroupedRowsByPage(
        where: Prisma.OperationWhereInput,
        page: number,
        pageSize: number,
    ): Promise<{ total: number; rows: GroupedOperationRow[] }> {
        const operationDelegate: any = this.prisma.operation;
        const [allGroups, pagedGroups] = await this.prisma.$transaction([
            operationDelegate.groupBy({
                by: ['groupId'],
                where,
            }),
            operationDelegate.groupBy({
                by: ['groupId'],
                where,
                _max: { createTime: true },
                orderBy: { _max: { createTime: 'desc' } },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
        ]);
        const total = allGroups.length;
        const groupIds = pagedGroups.map((item: { groupId: string }) => item.groupId);

        if (groupIds.length === 0) {
            return { total, rows: [] };
        }

        const operations = await this.prisma.operation.findMany({
            where: { ...where, groupId: { in: groupIds } },
            orderBy: [{ createTime: 'desc' }, { id: 'desc' }],
            include: operationListInclude,
        });
        const userMap = await this.loadUserMap([...new Set(operations.map((op) => op.userId))]);

        return {
            total,
            rows: this.groupOperationsByGroupId(operations, userMap, groupIds),
        };
    }

   /**
     * 将 operation 明细按 groupId 聚合为列表行数据。
     * - 组级字段（notes/action/status/user/snapshots）取该组第一条记录；
     * - barcodes 收集该组全部条码；
     * - 传入 orderedGroupIds 时按该顺序返回（用于数据库分页后的稳定排序）。
     */
   private groupOperationsByGroupId(
    operations: OperationListRecord[],
    userMap: Map<number, string>,
    orderedGroupIds?: string[],
): GroupedOperationRow[] {
    const grouped = new Map<string, GroupedOperationRow>();

    for (const op of operations) {
        const groupKey = op.groupId && op.groupId.trim() ? op.groupId : `legacy-${op.id}`;
        if (!grouped.has(groupKey)) {
            grouped.set(groupKey, {
                groupId: groupKey,
                createTime: op.createTime,
                reagent: { id: op.reagent.id, name: op.reagent.name },
                lot: { id: op.lot.id, name: op.lot.name },
                number: 0,
                barcodes: [],
                notes: op.note,
                action: op.action,
                status: op.status,
                user: {
                    id: op.userId,
                    userName: userMap.get(op.userId) ?? '',
                },
                snapshots: {
                    userName: op.userNameSnapshot ?? '',
                    reagentName: op.reagentNameSnapshot ?? '',
                    lotName: op.lotNameSnapshot ?? '',
                },
            });
        }

        const row = grouped.get(groupKey)!;
        row.number += 1;
        row.barcodes.push(op.barcodeNumber);
    }

    if (orderedGroupIds && orderedGroupIds.length > 0) {
        return orderedGroupIds
            .map((groupId) => grouped.get(groupId))
            .filter((row): row is NonNullable<typeof row> => Boolean(row));
    }

    return [...grouped.values()];
}



    /**
     * 分页查询操作记录（默认每页 10 条），返回数据与分页元信息。
     */
    async show(dto: OperationDto['requestShow'], session: SessionUser): Promise<OperationDto['responseShow']> {
        const where = this.buildOperationQuery(dto, session);
        const page = dto.page || 1;
        const pageSize = dto.pageSize || 10;
        const { total, rows } = await this.queryGroupedRowsByPage(where, page, pageSize);

        const totalPage = Math.ceil(total / pageSize);
        return { success: true, data: rows, meta: { total, page, pageSize, totalPage } };
    }

    /**
     * 查询全部操作记录（通过超大 pageSize 实现），返回数据与分页元信息。
     */
    async showAll(dto: OperationDto['requestShowAll'], session: SessionUser): Promise<OperationDto['responseShowAll']> {
        const where = this.buildOperationQuery(dto, session);
        const page = dto.page || 1;
        const pageSize = dto.pageSize || 9999999;
        const { total, rows } = await this.queryGroupedRowsByPage(where, page, pageSize);

        const totalPage = Math.ceil(total / pageSize);
        return { success: true, data: rows, meta: { total, page, pageSize, totalPage } };
    }
    async disable(dto: OperationDto['requestDisable'], session: SessionUser): Promise<OperationDto['responseDisable']> {
        const firstEnabledOperation = await this.prisma.operation.findFirst({
            where: {
                groupId: dto.groupId,
                ...teamScope(session),
            },
            select: {
                reagentId: true,
                lotId: true,
                action: true,
            },
        });

        if (firstEnabledOperation) {
            const enabledCount = await this.prisma.operation.count({
                where: {
                    groupId: dto.groupId,
                    status: Status.Enable,
                    ...teamScope(session),
                },
            });

            await this.prisma.operation.updateMany({
                where: {
                    groupId: dto.groupId,
                    status: Status.Enable,
                    ...teamScope(session),
                },
                data: { status: Status.Disable },
            });


            if (
                (firstEnabledOperation.action === OperationAction.Inbound ||
                    firstEnabledOperation.action === OperationAction.Outbound) &&
                enabledCount > 0
            ) {
                const deltaPerItem = firstEnabledOperation.action === OperationAction.Inbound ? -1 : 1;
                const totalDelta = deltaPerItem * enabledCount;
                await this.inventoryService.updateInventory(
                    firstEnabledOperation.reagentId,
                    totalDelta,
                    firstEnabledOperation.lotId,
                );
            }
        }
        else {
            throw new HttpException('操作记录不存在', HttpStatus.NOT_FOUND);
        }
        
        return { success: true, data: { groupId: dto.groupId } };
    }
}
