import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MangerPrismaService } from '../prisma/manger-prisma.service';
import { OperationDto } from './operation.dto';
import { Status, OperationAction } from '../common/enums/enums';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { InventoryService } from './inventory.service';
import { UserPrismaService } from '../prisma/user-prisma.service';
import type { Prisma } from '../../generated/prisma-manger/client';
import { LotService } from './lot.service';
import { GS1Field, GS1Parser } from '@valentynb/gs1-parser';

type OperationQueryFilters = Pick<OperationDto['requestShow'], 'reagentName' | 'barcodeNumber' | 'udi' | 'startTime' | 'endTime'>;

const operationListInclude = {
    reagent: { select: { id: true, name: true } },
    lot: { select: { id: true, name: true } },
} as const;

type OperationListRecord = Prisma.OperationGetPayload<{ include: typeof operationListInclude }>;
type GroupedOperationRow = OperationDto['responseShow']['data'][number];

@Injectable()
export class OperationService {
    private readonly gs1Parser = new GS1Parser();

    constructor(
        private readonly prisma: MangerPrismaService,
        private readonly userPrisma: UserPrismaService,
        private readonly inventoryService: InventoryService,
        private readonly lotService: LotService,
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
    private async reserveBarcodeRange(count: number, tx: Prisma.TransactionClient): Promise<bigint> {
        const row = await tx.barcodeCounter.upsert({
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
     * 使用 GS1 解析库解析 UDI，并抽取业务必需字段。
     */
    private parseUdi(udi: string): { di: string; lotName: string; ProductionDate: Date; expirationDate: Date } | null {
        const normalized = String(udi ?? '').trim();
        if (!normalized) return null;

        try {
            const decoded = this.gs1Parser.decode(normalized);

            const di = decoded.data[GS1Field.GTIN]?.data;
            const lotName = decoded.data[GS1Field.BATCH]?.data;
            const productionDate = decoded.data[GS1Field.PROD_DATE]?.data;
            const expirationDate = decoded.data[GS1Field.EXP_DATE]?.data;
            const parsedSerial = decoded.data[GS1Field.SERIAL]?.data;

            if (typeof di !== 'string' || !/^\d{14}$/.test(di)) return null;
            if (typeof lotName !== 'string' || lotName.trim() === '') return null;
            if (!(productionDate instanceof Date) || Number.isNaN(productionDate.getTime())) return null;
            if (!(expirationDate instanceof Date) || Number.isNaN(expirationDate.getTime())) return null;
            if (typeof parsedSerial !== 'string' || parsedSerial.trim() === '') return null;

            return {
                di,
                lotName: lotName.trim(),
                ProductionDate: productionDate,
                expirationDate,
            };
        } catch {
            return null;
        }
    }

    /**
     * 快速入库前置校验：
     * 1. 若该 UDI 已有入库记录，返回“该UDI已经入库”；
     * 2. 按 UDI 中首个 "01" 提取 14 位 DI，失败返回“无效的UDI”；
     * 3. 用 DI 匹配试剂，未维护返回“该UDI 试剂信息没有维护”。
     */
    async fastInbound(
        dto: OperationDto['requestFastInbound'],
        session: SessionUser,
        tx: Prisma.TransactionClient,
    ): Promise<OperationDto['responseFastInbound']> {
        const normalizedUdiInput = String(dto.udi ?? '').trim();
        const normalizedNote = String(dto.note ?? '').trim();
        const normalizedUdi = this.parseUdi(normalizedUdiInput);
        if (!normalizedUdi) {
            return { success: true, data: { status: 1, message: '无效的UDI' } };
        }
        const userName = await this.loadUserName(session.userId);
        const existReagent = await tx.reagent.findFirst({
            where: {
                di: normalizedUdi.di,
                status: { not: Status.Delete },
            },
        });
        if (!existReagent) {
            return { success: true, data: { status: 1, message: '该UDI 试剂信息没有维护' } };
        }

        let existLot = await tx.lot.findFirst({
            where: {
                name: normalizedUdi.lotName,
                reagentId: existReagent.id,
                status: { not: Status.Delete },
            },
            select: { id: true, name: true },
        });
        if (!existLot) {
            const addedLot = await this.lotService.add(
                {
                    reagentId: existReagent.id,
                    name: normalizedUdi.lotName,
                    expirationDate: normalizedUdi.expirationDate,
                },
                session,
                tx,
            );
            existLot = addedLot.data;
        }

        const existOperation = await tx.operation.findFirst({
            where: {
                udi: normalizedUdiInput,
                action: OperationAction.Inbound,
                status: Status.Enable,
            },
        });
        if (existOperation) {
            return { success: true, data: { status: 1, message: '该UDI已经入库' } };
        }

        const startId = await this.reserveBarcodeRange(1, tx);
        const barcodeNumber = this.encodeBarcode(startId);
        await tx.operation.create({
            data: {
                reagentId: existReagent.id,
                lotId: existLot.id,
                userId: session.userId,
                teamId: session.teamId,
                groupId: randomUUID(),
                barcodeNumber,
                note: normalizedNote || '快速入库',
                action: OperationAction.Inbound,
                status: Status.Enable,
                userNameSnapshot: userName,
                reagentNameSnapshot: existReagent.name,
                lotNameSnapshot: existLot.name,
                udi: normalizedUdiInput,
            },
        });
        const result = await this.inventoryService.updateInventory(existReagent.id, 1, existLot.id, tx);
        return { success: true, data: { status: result.isSuccess ? 0 : 1, message: result.message } };
    }

    /**
     * 入库操作：
     * 1. 按入库明细生成 operation 记录；
     * 2. 批量更新库存；
     * 3. 返回每条库存更新结果信息。
     */
    async inbound(
        dto: OperationDto['requestInbound'],
        session: SessionUser,
        tx: Prisma.TransactionClient,
    ): Promise<OperationDto['responseInbound']> {
        const totalCount = dto.inboundList.reduce((sum, item) => sum + item.number, 0);
        const reagentIds = [...new Set(dto.inboundList.map((item) => item.reagentId))];
        const lotIds = [...new Set(dto.inboundList.map((item) => item.lotId))];
        const [reagentMap, lotMap, userName] = await Promise.all([
            this.loadReagentMap(reagentIds),
            this.loadLotMap(lotIds),
            this.loadUserName(session.userId),
        ]);
        const startId = await this.reserveBarcodeRange(totalCount, tx);
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
                    udi: randomUUID(),
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

        await tx.operation.createMany({ data: operationsData });

        const inventoryResults: { isSuccess: boolean; message: string }[] = [];
        for (const item of dto.inboundList) {
            const result = await this.inventoryService.updateInventory(item.reagentId, item.number, item.lotId, tx);
            if (!result.isSuccess) {
                throw new HttpException(result.message, HttpStatus.FORBIDDEN);
            }
            inventoryResults.push(result);
        }

        return {
            success: true,
            data: { messages: inventoryResults.map((r) => r.message) },
        };
    }

    /**
     * 快速出库（按条码或UDI）：
     * - 校验条码是否已入库、是否已出库；
     * - 未出库时创建出库记录并扣减库存；
     * - 返回处理状态与消息。
     */
    async fastOutbound(
        dto: OperationDto['requestFastOutbound'],
        session: SessionUser,
        tx: Prisma.TransactionClient,
    ): Promise<OperationDto['responseFastOutbound']> {
        const notInboundMessage = dto.useUdi ? '该UDI未进行入库' : '该条码未进行入库';
        const alreadyOutboundMessage = dto.useUdi ? '该UDI已经出库' : '该条码已经出库';
        const normalizedNote = String(dto.note ?? '').trim();
        let identifierWhere: Prisma.OperationWhereInput;
        let outboundUdi: string = randomUUID();

        if (dto.useUdi) {
            const normalizedUdiInput = String(dto.udi ?? '').trim();
            const parsedUdi = this.parseUdi(normalizedUdiInput);
            if (!parsedUdi) {
                return { success: true, data: { status: 1, message: '无效的UDI' } };
            }
            identifierWhere = { udi: normalizedUdiInput };
            outboundUdi = normalizedUdiInput;
        } else {
            const barcodeNumber = String(dto.barcodeNumber ?? '').trim();
            if (!barcodeNumber) {
                return { success: true, data: { status: 1, message: '无效的条码' } };
            }
            identifierWhere = { barcodeNumber };
        }

        const userName = await this.loadUserName(session.userId);
        const [origin, outboundOperation] = await Promise.all([
            tx.operation.findFirst({
                where: {
                    ...identifierWhere,
                    action: OperationAction.Inbound,
                    status: Status.Enable,
                },
                include: {
                    reagent: { select: { name: true } },
                    lot: { select: { name: true } },
                },
            }),
            tx.operation.findFirst({
                where: {
                    ...identifierWhere,
                    action: OperationAction.Outbound,
                    status: Status.Enable,
                },
                select: { id: true },
            }),
        ]);

        if (!origin && !outboundOperation) {
            return { success: true, data: { status: 1, message: notInboundMessage } };
        }
        if (outboundOperation) {
            return { success: true, data: { status: 1, message: alreadyOutboundMessage } };
        }
        if (!origin) {
            return { success: true, data: { status: 1, message: notInboundMessage } };
        }

        const result = await this.inventoryService.updateInventory(origin.reagentId, -1, origin.lotId, tx);
        if (!result.isSuccess) {
            return { success: true, data: { status: 1, message: result.message } };
        }

        await tx.operation.create({
            data: {
                reagentId: origin.reagentId,
                lotId: origin.lotId,
                userId: session.userId,
                teamId: origin.teamId,
                groupId: randomUUID(),
                udi: origin.udi || outboundUdi,
                barcodeNumber: origin.barcodeNumber,
                note: normalizedNote || '快速出库',
                action: OperationAction.Outbound,
                status: Status.Enable,
                userNameSnapshot: userName,
                reagentNameSnapshot: origin.reagentNameSnapshot || origin.reagent.name,
                lotNameSnapshot: origin.lotNameSnapshot || origin.lot.name,
            },
        });
        return { success: true, data: { status: 0, message: result.message } };

    }

    /**
     * 出库（无原始入库条码或批量场景）：
     * 先逐条尝试扣减库存，仅为成功项生成出库操作记录并分配新条码。
     */
    async outbound(
        dto: OperationDto['requestOutbound'],
        session: SessionUser,
        tx: Prisma.TransactionClient,
    ): Promise<OperationDto['responseOutbound']> {
        const reagentIds = [...new Set(dto.outboundList.map((item) => item.reagentId))];
        const lotIds = [...new Set(dto.outboundList.map((item) => item.lotId))];
        const [reagentMap, lotMap, userName] = await Promise.all([
            this.loadReagentMap(reagentIds),
            this.loadLotMap(lotIds),
            this.loadUserName(session.userId),
        ]);
        const inventoryResults: { isSuccess: boolean; message: string }[] = [];
        for (const item of dto.outboundList) {
            const result = await this.inventoryService.updateInventory(item.reagentId, -item.number, item.lotId, tx);
            inventoryResults.push(result);
        }

        const validCount = dto.outboundList.reduce((sum, item, i) => sum + (inventoryResults[i].isSuccess ? item.number : 0), 0);
        if (validCount > 0) {
            const validOperations: Prisma.OperationCreateManyInput[] = [];
            const startId = await this.reserveBarcodeRange(validCount, tx);
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
                        udi: randomUUID(),
                    });
                }
            }
            await tx.operation.createMany({ data: validOperations });
        }

        return {
            success: true,
            data: { messages: inventoryResults.map((r) => r.message) },
        };
    }

    /**
     * 构建操作记录查询条件（状态过滤 + 名称/条码/时间范围）。
     */
    private buildOperationQuery(dto: OperationQueryFilters, session: SessionUser): Prisma.OperationWhereInput {
        const where: Prisma.OperationWhereInput = { status: { not: Status.Delete } };
        if (dto.reagentName) { where.reagent = { name: { contains: dto.reagentName } }; }
        if (dto.barcodeNumber) { where.barcodeNumber = { contains: dto.barcodeNumber }; }
        if (dto.udi) { where.udi = { contains: dto.udi }; }
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
                udis:[],
                note: op.note,
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
        row.udis.push(op.udi);
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
    async disable(
        dto: OperationDto['requestDisable'],
        session: SessionUser,
        tx: Prisma.TransactionClient,
    ): Promise<OperationDto['responseDisable']> {
        const firstEnabledOperation = await tx.operation.findFirst({
            where: {
                groupId: dto.groupId,
            },
            select: {
                reagentId: true,
                lotId: true,
                action: true,
            },
        });

        if (!firstEnabledOperation) {
            throw new HttpException('操作记录不存在', HttpStatus.NOT_FOUND);
        }

        const enabledCount = await tx.operation.count({
            where: {
                groupId: dto.groupId,
                status: Status.Enable,
            },
        });

        await tx.operation.updateMany({
            where: {
                groupId: dto.groupId,
                status: Status.Enable,
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
            const result = await this.inventoryService.updateInventory(
                firstEnabledOperation.reagentId,
                totalDelta,
                firstEnabledOperation.lotId,
                tx,
            );
            if (!result.isSuccess) {
                throw new HttpException(result.message, HttpStatus.FORBIDDEN);
            }
        }

        return { success: true, data: { groupId: dto.groupId } };
    }
}
