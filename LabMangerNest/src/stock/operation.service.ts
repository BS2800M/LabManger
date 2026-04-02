import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MangerPrismaService } from '../prisma/manger-prisma.service';
import { OperationDto } from './operation.dto';
import { Status, OperationAction } from '../common/enums/enums';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { InventoryService } from './inventory.service';
import { UserPrismaService } from '../prisma/user-prisma.service';
import { Prisma } from '../../generated/prisma-manger/client';
import { LotService } from './lot.service';
import { GS1Field, GS1Parser } from '@valentynb/gs1-parser';

type OperationQueryFilters = Pick<
  OperationDto['requestShow'],
  'reagentName' | 'barcodeNumber' | 'udi' | 'startTime' | 'endTime'
>;

const operationBatchArgs = {
  // 列表查询统一读取批次头 + 明细项，避免每个接口重复拼 include。
  include: {
    reagent: { select: { id: true, name: true } },
    lot: { select: { id: true, name: true } },
    items: {
      where: { status: { not: Status.Delete } },
      orderBy: [{ id: 'asc' }],
    },
  },
} satisfies Prisma.OperationBatchDefaultArgs;

type OperationBatchRecord = Prisma.OperationBatchGetPayload<typeof operationBatchArgs>;
type OperationListRow = OperationDto['responseShow']['data'][number];

@Injectable()
export class OperationService {
  private readonly gs1Parser = new GS1Parser();

  // 注入 operation 依赖服务：业务库、用户库、库存服务与批号服务。
  constructor(
    private readonly prisma: MangerPrismaService,
    private readonly userPrisma: UserPrismaService,
    private readonly inventoryService: InventoryService,
    private readonly lotService: LotService,
  ) {}

  // 批量查询后统一构建用户快照映射，避免逐行查用户表。
  private async loadUserMap(userIds: number[]): Promise<Map<number, string>> {
    if (userIds.length === 0) return new Map();
    const users = await this.userPrisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, userName: true },
    });
    return new Map(users.map((user) => [user.id, user.userName]));
  }

  private async loadReagentMap(reagentIds: number[]): Promise<Map<number, string>> {
    // 预加载试剂名快照，批量写入时避免重复查表。
    if (reagentIds.length === 0) return new Map();
    const reagents = await this.prisma.reagent.findMany({
      where: { id: { in: reagentIds } },
      select: { id: true, name: true },
    });
    return new Map(reagents.map((reagent) => [reagent.id, reagent.name]));
  }

  private async loadLotMap(lotIds: number[]): Promise<Map<number, string>> {
    // 预加载批号名快照，供批次头快照字段落库使用。
    if (lotIds.length === 0) return new Map();
    const lots = await this.prisma.lot.findMany({
      where: { id: { in: lotIds } },
      select: { id: true, name: true },
    });
    return new Map(lots.map((lot) => [lot.id, lot.name]));
  }

  private async reserveBarcodeRange(
    count: number,
    tx: Prisma.TransactionClient,
  ): Promise<bigint> {
    // 通过计数器一次性预留区间，保证并发下条码不重复。
    const row = await tx.barcodeCounter.upsert({
      where: { id: 1 },
      create: { id: 1, value: count },
      update: { value: { increment: count } },
    });
    return row.value - BigInt(count);
  }

  private encodeBarcode(n: bigint): string {
    // 统一条码编码规则：36进制 + 固定长度，保证展示和导出一致。
    return n.toString(36).toUpperCase().padStart(8, '0');
  }

  private parseUdi(
    udi: string,
  ): { di: string; lotName: string; productionDate: Date; expirationDate: Date } | null {
    // 仅接受完整可解析的 GS1 UDI，失败直接返回 null 交由上层处理。
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
      if (!(productionDate instanceof Date) || Number.isNaN(productionDate.getTime())) {
        return null;
      }
      if (!(expirationDate instanceof Date) || Number.isNaN(expirationDate.getTime())) {
        return null;
      }
      if (typeof parsedSerial !== 'string' || parsedSerial.trim() === '') return null;

      return {
        di,
        lotName: lotName.trim(),
        productionDate,
        expirationDate,
      };
    } catch {
      return null;
    }
  }

  private async createBatch(
    tx: Prisma.TransactionClient,
    params: {
      teamId: number;
      reagentId: number;
      lotId: number;
      userId: number;
      action: number;
      note: string;
      reagentNameSnapshot: string;
      lotNameSnapshot: string;
    },
  ): Promise<number> {
    // 批次头存储业务归属字段和快照字段；明细表只保留条码明细。
    const batch = await tx.operationBatch.create({
      data: {
        teamId: params.teamId,
        reagentId: params.reagentId,
        lotId: params.lotId,
        userId: params.userId,
        action: params.action,
        note: params.note,
        status: Status.Enable,
        reagentNameSnapshot: params.reagentNameSnapshot,
        lotNameSnapshot: params.lotNameSnapshot,
      },
      select: { id: true },
    });
    return batch.id;
  }

  private buildBatchQuery(dto: OperationQueryFilters): Prisma.OperationBatchWhereInput {
    // 展示查询仅过滤未删除批次，不按 team 做组隔离。
    const where: Prisma.OperationBatchWhereInput = {
      status: { not: Status.Delete },
      items: {
        some: {
          status: { not: Status.Delete },
        },
      },
    };

    if (dto.startTime || dto.endTime) {
      where.createTime = {};
      if (dto.startTime) where.createTime.gte = dto.startTime;
      if (dto.endTime) where.createTime.lte = dto.endTime;
    }

    if (dto.reagentName) {
      where.reagentNameSnapshot = { contains: dto.reagentName };
    }
    if (dto.barcodeNumber) {
      where.items = {
        some: {
          status: { not: Status.Delete },
          barcodeNumber: { contains: dto.barcodeNumber },
        },
      };
    }
    if (dto.udi) {
      // 若 barcode/udi 同时传入，需要在同一个 items.some 中叠加条件。
      const baseSome = where.items?.some ?? { status: { not: Status.Delete } };
      where.items = {
        some: {
          ...baseSome,
          udi: { contains: dto.udi },
        },
      };
    }
    return where;
  }

  private mapBatchesToRows(
    batches: OperationBatchRecord[],
    userMap: Map<number, string>,
  ): OperationListRow[] {
    // 后端统一输出前端需要的展示模型，前端不再二次拼装快照字段。
    const rows: OperationListRow[] = [];

    for (const batch of batches) {
      const items = batch.items.filter((item) => item.status !== Status.Delete);
      if (items.length === 0) continue;

      rows.push({
        batchId: batch.id,
        createTime: batch.createTime,
        reagent: { id: batch.reagent.id, name: batch.reagent.name },
        lot: { id: batch.lot.id, name: batch.lot.name },
        number: items.length,
        detailData: items.map((item) => ({
          id: item.id,
          barcodeNumber: item.barcodeNumber,
          udi: item.udi,
        })),
        note: batch.note,
        action: batch.action,
        status: batch.status,
        user: {
          id: batch.userId,
          userName: userMap.get(batch.userId) ?? '',
        },
        userNameSnapshot: userMap.get(batch.userId) ?? '',
        reagentNameSnapshot: batch.reagentNameSnapshot || batch.reagent.name,
        lotNameSnapshot: batch.lotNameSnapshot || batch.lot.name,
      });
    }

    return rows;
  }

  async fastInbound(
    dto: OperationDto['requestFastInbound'],
    session: SessionUser,
    tx: Prisma.TransactionClient,
  ): Promise<OperationDto['responseFastInbound']> {
    // 快速入库：解析 UDI -> 定位试剂/批号 -> 写批次/明细 -> 更新库存。
    const normalizedUdiInput = String(dto.udi ?? '').trim();
    const normalizedNote = String(dto.note ?? '').trim();
    const normalizedUdi = this.parseUdi(normalizedUdiInput);
    if (!normalizedUdi) {
      return { success: true, data: { status: 1, message: '无效的UDI' } };
    }

    const existReagent = await tx.reagent.findFirst({
      where: {
        teamId: session.teamId,
        di: normalizedUdi.di,
        status: { not: Status.Delete },
      },
    });
    if (!existReagent) {
      return { success: true, data: { status: 1, message: '该UDI 试剂信息没有维护' } };
    }

    let existLot = await tx.lot.findFirst({
      where: {
        teamId: session.teamId,
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

    const existInbound = await tx.operationItem.findFirst({
      where: {
        udi: normalizedUdiInput,
        status: Status.Enable,
        batch: {
          teamId: session.teamId,
          action: OperationAction.Inbound,
          status: Status.Enable,
        },
      },
      select: { id: true },
    });

    if (existInbound) {
      return { success: true, data: { status: 1, message: '该UDI已经入库' } };
    }

    const startId = await this.reserveBarcodeRange(1, tx);
    const batchId = await this.createBatch(tx, {
      teamId: session.teamId,
      reagentId: existReagent.id,
      lotId: existLot.id,
      userId: session.userId,
      action: OperationAction.Inbound,
      note: normalizedNote || '快速入库',
      reagentNameSnapshot: existReagent.name,
      lotNameSnapshot: existLot.name,
    });

    await tx.operationItem.create({
      data: {
        batchId,
        barcodeNumber: this.encodeBarcode(startId),
        udi: normalizedUdiInput,
        status: Status.Enable,
      },
    });

    const result = await this.inventoryService.updateInventory(
      existReagent.id,
      1,
      existLot.id,
      tx,
    );

    return { success: true, data: { status: result.isSuccess ? 0 : 1, message: result.message } };
  }

  async inbound(
    dto: OperationDto['requestInbound'],
    session: SessionUser,
    tx: Prisma.TransactionClient,
  ): Promise<OperationDto['responseInbound']> {
    // 普通入库：一条 inboundList 对应一个批次头，多个条码明细挂在同一批次下。
    const totalCount = dto.inboundList.reduce((sum, item) => sum + item.number, 0);
    const reagentIds = [...new Set(dto.inboundList.map((item) => item.reagentId))];
    const lotIds = [...new Set(dto.inboundList.map((item) => item.lotId))];
    const [reagentMap, lotMap] = await Promise.all([
      this.loadReagentMap(reagentIds),
      this.loadLotMap(lotIds),
    ]);

    const startId = await this.reserveBarcodeRange(totalCount, tx);
    let offset = 0;
    const inventoryResults: { isSuccess: boolean; message: string }[] = [];

    for (const item of dto.inboundList) {
      const batchId = await this.createBatch(tx, {
        teamId: session.teamId,
        reagentId: item.reagentId,
        lotId: item.lotId,
        userId: session.userId,
        action: OperationAction.Inbound,
        note: String(item.note ?? ''),
        reagentNameSnapshot: reagentMap.get(item.reagentId) ?? '',
        lotNameSnapshot: lotMap.get(item.lotId) ?? '',
      });

      const itemsData: Prisma.OperationItemCreateManyInput[] = [];
      for (let i = 0; i < item.number; i++) {
        itemsData.push({
          batchId,
          barcodeNumber: this.encodeBarcode(startId + BigInt(offset++)),
          udi: randomUUID(),
          status: Status.Enable,
        });
      }
      await tx.operationItem.createMany({ data: itemsData });

      const result = await this.inventoryService.updateInventory(
        item.reagentId,
        item.number,
        item.lotId,
        tx,
      );
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

  async fastOutbound(
    dto: OperationDto['requestFastOutbound'],
    session: SessionUser,
    tx: Prisma.TransactionClient,
  ): Promise<OperationDto['responseFastOutbound']> {
    // 快速出库：通过 UDI/条码定位已入库记录，再写出库批次并扣减库存。
    const notInboundMessage = dto.useUdi ? '该UDI未进行入库' : '该条码未进行入库';
    const alreadyOutboundMessage = dto.useUdi ? '该UDI已经出库' : '该条码已经出库';
    const normalizedNote = String(dto.note ?? '').trim();

    let identifierWhere: Prisma.OperationItemWhereInput;
    if (dto.useUdi) {
      const normalizedUdiInput = String(dto.udi ?? '').trim();
      const parsedUdi = this.parseUdi(normalizedUdiInput);
      if (!parsedUdi) {
        return { success: true, data: { status: 1, message: '无效的UDI' } };
      }
      identifierWhere = { udi: normalizedUdiInput };
    } else {
      const barcodeNumber = String(dto.barcodeNumber ?? '').trim();
      if (!barcodeNumber) {
        return { success: true, data: { status: 1, message: '无效的条码' } };
      }
      identifierWhere = { barcodeNumber };
    }

    const origin = await tx.operationItem.findFirst({
      where: {
        ...identifierWhere,
        status: Status.Enable,
        batch: {
          teamId: session.teamId,
          action: OperationAction.Inbound,
          status: Status.Enable,
        },
      },
      include: {
        batch: {
          include: {
            reagent: { select: { name: true } },
            lot: { select: { name: true } },
          },
        },
      },
    });

    if (!origin) {
      return { success: true, data: { status: 1, message: notInboundMessage } };
    }

    const outboundExists = await tx.operationItem.findFirst({
      where: {
        udi: origin.udi,
        status: Status.Enable,
        batch: {
          teamId: session.teamId,
          action: OperationAction.Outbound,
          status: Status.Enable,
        },
      },
      select: { id: true },
    });

    if (outboundExists) {
      return { success: true, data: { status: 1, message: alreadyOutboundMessage } };
    }

    const result = await this.inventoryService.updateInventory(
      origin.batch.reagentId,
      -1,
      origin.batch.lotId,
      tx,
    );

    if (!result.isSuccess) {
      return { success: true, data: { status: 1, message: result.message } };
    }

    const startId = await this.reserveBarcodeRange(1, tx);
    const batchId = await this.createBatch(tx, {
      teamId: origin.batch.teamId,
      reagentId: origin.batch.reagentId,
      lotId: origin.batch.lotId,
      userId: session.userId,
      action: OperationAction.Outbound,
      note: normalizedNote || '快速出库',
      reagentNameSnapshot:
        origin.batch.reagentNameSnapshot || origin.batch.reagent.name,
      lotNameSnapshot: origin.batch.lotNameSnapshot || origin.batch.lot.name,
    });

    await tx.operationItem.create({
      data: {
        batchId,
        barcodeNumber: this.encodeBarcode(startId),
        udi: origin.udi,
        status: Status.Enable,
      },
    });

    return { success: true, data: { status: 0, message: result.message } };
  }

  async outbound(
    dto: OperationDto['requestOutbound'],
    session: SessionUser,
    tx: Prisma.TransactionClient,
  ): Promise<OperationDto['responseOutbound']> {
    // 普通出库：先逐项校验库存，再为成功项写批次和明细，失败项仅返回提示。
    const reagentIds = [...new Set(dto.outboundList.map((item) => item.reagentId))];
    const lotIds = [...new Set(dto.outboundList.map((item) => item.lotId))];
    const [reagentMap, lotMap] = await Promise.all([
      this.loadReagentMap(reagentIds),
      this.loadLotMap(lotIds),
    ]);

    const inventoryResults: { isSuccess: boolean; message: string }[] = [];
    for (const item of dto.outboundList) {
      const result = await this.inventoryService.updateInventory(
        item.reagentId,
        -item.number,
        item.lotId,
        tx,
      );
      inventoryResults.push(result);
    }

    const validCount = dto.outboundList.reduce(
      (sum, item, i) => sum + (inventoryResults[i].isSuccess ? item.number : 0),
      0,
    );

    if (validCount > 0) {
      const startId = await this.reserveBarcodeRange(validCount, tx);
      let offset = 0;

      for (let i = 0; i < dto.outboundList.length; i++) {
        if (!inventoryResults[i].isSuccess) continue;
        const item = dto.outboundList[i];

        const batchId = await this.createBatch(tx, {
          teamId: session.teamId,
          reagentId: item.reagentId,
          lotId: item.lotId,
          userId: session.userId,
          action: OperationAction.Outbound,
          note: String(item.note ?? ''),
          reagentNameSnapshot: reagentMap.get(item.reagentId) ?? '',
          lotNameSnapshot: lotMap.get(item.lotId) ?? '',
        });

        const itemsData: Prisma.OperationItemCreateManyInput[] = [];
        for (let j = 0; j < item.number; j++) {
          itemsData.push({
            batchId,
            barcodeNumber: this.encodeBarcode(startId + BigInt(offset++)),
            udi: randomUUID(),
            status: Status.Enable,
          });
        }
        await tx.operationItem.createMany({ data: itemsData });
      }
    }

    return {
      success: true,
      data: { messages: inventoryResults.map((r) => r.message) },
    };
  }

  async show(
    dto: OperationDto['requestShow'],
    _session: SessionUser,
  ): Promise<OperationDto['responseShow']> {
    // 分页查询批次头，明细随批次一并返回。
    const where = this.buildBatchQuery(dto);
    const page = dto.page || 1;
    const pageSize = dto.pageSize || 10;

    const [batches, total] = await Promise.all([
      this.prisma.operationBatch.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ createTime: 'desc' }, { id: 'desc' }],
        include: operationBatchArgs.include,
      }),
      this.prisma.operationBatch.count({ where }),
    ]);

    const userMap = await this.loadUserMap([...new Set(batches.map((batch) => batch.userId))]);
    const rows = this.mapBatchesToRows(batches, userMap);
    const totalPage = Math.ceil(total / pageSize);

    return { success: true, data: rows, meta: { total, page, pageSize, totalPage } };
  }

  async showAll(
    dto: OperationDto['requestShowAll'],
    _session: SessionUser,
  ): Promise<OperationDto['responseShowAll']> {
    // 导出/全量查询复用同一套筛选逻辑，仅放宽 pageSize。
    const where = this.buildBatchQuery(dto);
    const page = dto.page || 1;
    const pageSize = dto.pageSize || 9999999;

    const [batches, total] = await Promise.all([
      this.prisma.operationBatch.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ createTime: 'desc' }, { id: 'desc' }],
        include: operationBatchArgs.include,
      }),
      this.prisma.operationBatch.count({ where }),
    ]);

    const userMap = await this.loadUserMap([...new Set(batches.map((batch) => batch.userId))]);
    const rows = this.mapBatchesToRows(batches, userMap);
    const totalPage = Math.ceil(total / pageSize);

    return { success: true, data: rows, meta: { total, page, pageSize, totalPage } };
  }

  async disable(
    dto: OperationDto['requestDisable'],
    session: SessionUser,
    tx: Prisma.TransactionClient,
  ): Promise<OperationDto['responseDisable']> {
    // 禁用批次等价于“撤销该批次对库存的影响”。
    const batch = await tx.operationBatch.findFirst({
      where: {
        id: dto.batchId,
        teamId: session.teamId,
      },
      select: { id: true, action: true, reagentId: true, lotId: true },
    });

    if (!batch) {
      throw new HttpException('操作记录不存在', HttpStatus.NOT_FOUND);
    }

    const enabledCount = await tx.operationItem.count({
      where: {
        batchId: dto.batchId,
        status: Status.Enable,
      },
    });

    await tx.operationItem.updateMany({
      where: {
        batchId: dto.batchId,
        status: Status.Enable,
      },
      data: { status: Status.Disable },
    });

    await tx.operationBatch.update({
      where: { id: dto.batchId },
      data: { status: Status.Disable },
    });

    if (
      (batch.action === OperationAction.Inbound ||
        batch.action === OperationAction.Outbound) &&
      enabledCount > 0
    ) {
      const delta = batch.action === OperationAction.Inbound ? -enabledCount : enabledCount;
      const result = await this.inventoryService.updateInventory(
        batch.reagentId,
        delta,
        batch.lotId,
        tx,
      );
      if (!result.isSuccess) {
        throw new HttpException(result.message, HttpStatus.FORBIDDEN);
      }
    }

    return { success: true, data: { batchId: dto.batchId } };
  }
}
