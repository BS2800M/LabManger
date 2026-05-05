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
import { is } from 'zod/v4/locales';


type OperationQueryFilters = Pick<
  OperationDto['requestShow'],
  'reagentName' | 'barcodeNumber' | 'udi' | 'startTime' | 'endTime'
>;



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



  private buildBatchQuery(dto: OperationQueryFilters): Prisma.OperationBatchWhereInput {
    // 展示查询仅过滤未删除批次
    const where: Prisma.OperationBatchWhereInput = {
      status: { not: Status.Delete },
      items: {
        some: {
          status: { not: Status.Delete },
        },
      },
    };

    if (dto.startTime || dto.endTime) {
      where.createdAt = {};
      if (dto.startTime) where.createdAt.gte = dto.startTime;
      if (dto.endTime) where.createdAt.lte = dto.endTime;
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
      where.items = {
        some: {
          ...where.items?.some,
          udi: { contains: dto.udi },
        },
      };
    }
    return where;
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
      return { success: true, data: { status:false, message: '无效的UDI' } };
    }

    const existReagent = await tx.reagent.findFirst({
      where: {
        teamId: session.teamId,
        di: normalizedUdi.di,
        status: { not: Status.Delete },
      },
    });
    if (!existReagent) {
        return { success: true, data: { status: false, message: '该UDI 试剂信息没有维护' } };
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
      return { success: true, data: { status: false, message: '该UDI已经入库' } };
    }

    const result = await this.inventoryService.updateInventory(
      existReagent.id,
      1,
      existLot.id,
      tx,
      { allowExpiringInbound: dto.allowExpiringInbound, allowNegativeInventory: false },
    );

    if (result.isSuccess===false) {
      return {
        success: true,
        data: { status: false, message: result.message },
      };
    }

    const startId = await this.reserveBarcodeRange(1, tx);
    const batch = await tx.operationBatch.create({
      data: {
      actionNum:1,
      teamId: session.teamId,
      reagentId: existReagent.id,
      lotId: existLot.id,
      userId: session.userId,
      action: OperationAction.Inbound,
      note: normalizedNote || '快速入库',
      reagentNameSnapshot: existReagent.name,
      lotNameSnapshot: existLot.name,
      userNameSnapshot: session.userName ?? '未知用户',
      }
    });
    await tx.operationItem.create({
      data: {
        batchId: batch.id,
        barcodeNumber: this.encodeBarcode(startId),
        udi: normalizedUdiInput,
        status: Status.Enable,
      },
    });

    return {
      success: true,
      data: { status: result.isSuccess, message: result.message },
    };
  }

  async inbound(
    dto: OperationDto['requestInbound'],
    session: SessionUser,
    tx: Prisma.TransactionClient,
  ): Promise<OperationDto['responseInbound']> {
    // 普通入库：一条 inboundList 对应一个批次头，多个条码明细挂在同一批次下。
    if (dto.inboundList.length === 0) {
      return { success: true, data:[{isSuccess: false, message: '入库列表不能为空'}] ,barcodeData: [] };
    }
    const reagentIds = [...new Set(dto.inboundList.map((item) => item.reagentId))];
    const lotIds = [...new Set(dto.inboundList.map((item) => item.lotId))];
    const [reagentMap, lotMap] = await Promise.all([
      this.loadReagentMap(reagentIds),
      this.loadLotMap(lotIds),
    ]);
    const responseBarcodeData :{barcodeNumber: string,reagentName: string,lotName: string}[]= [];

    let inventoryResults = await Promise.all(
      dto.inboundList.map(async (item) => {
        return await this.inventoryService.updateInventory(
          item.reagentId,
          item.number,
          item.lotId,
          tx,
          { allowExpiringInbound: dto.allowExpiringInbound, allowNegativeInventory: false },
        );
      })
    );

    const filterInboundList = dto.inboundList.filter((_, i) => inventoryResults[i].isSuccess);
    const totalInboundCount = filterInboundList.reduce((sum, item) => sum + item.number, 0);

    if (totalInboundCount > 0) {
      let nextBarcodeId = await this.reserveBarcodeRange(totalInboundCount, tx);

      for (const item of filterInboundList) {
        const batch = await tx.operationBatch.create({
          data: {
            actionNum: item.number,
            teamId: session.teamId,
            reagentId: item.reagentId,
            lotId: item.lotId,
            userId: session.userId,
            action: OperationAction.Inbound,
            note: String(item.note ?? ''),
            reagentNameSnapshot: reagentMap.get(item.reagentId) ?? '',
            lotNameSnapshot: lotMap.get(item.lotId) ?? '',
            userNameSnapshot: session.userName ?? '未知用户',
          },
        });

        const itemsData: Prisma.OperationItemCreateManyInput[] = [];
        for (let j = 0; j < item.number; j++) {
          itemsData.push({
            batchId: batch.id,
            barcodeNumber: this.encodeBarcode(nextBarcodeId + BigInt(j)),
            udi: randomUUID(),
            status: Status.Enable,
          });
          responseBarcodeData.push({
            barcodeNumber: this.encodeBarcode(nextBarcodeId + BigInt(j)),
            reagentName: reagentMap.get(item.reagentId) ?? '',
            lotName: lotMap.get(item.lotId) ?? '',
          });
        }
        await tx.operationItem.createMany({ data: itemsData });
        nextBarcodeId += BigInt(item.number);
      }
    }

    return {
      success: true,
      data: inventoryResults,
      barcodeData: responseBarcodeData,
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
        return { success: true, data: { status: false, message: '无效的UDI' } };
      }
      identifierWhere = { udi: normalizedUdiInput };
    } else {
      const barcodeNumber = String(dto.barcodeNumber ?? '').trim();
      if (!barcodeNumber) {
        return { success: true, data: { status: false, message: '无效的条码' } };
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
    select: {
      barcodeNumber: true, 
      udi: true,
      batch: {
        include: {
          reagent: { select: { name: true } },
          lot: { select: { name: true } },
        },
      },
    },
  });

    if (!origin) {
      return { success: true, data: { status: false, message: notInboundMessage } };
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
      select: { id: true ,barcodeNumber:true},
    });

    if (outboundExists) {
      return { success: true, data: { status: false, message: alreadyOutboundMessage } };
    }

    const result = await this.inventoryService.updateInventory(
      origin.batch.reagentId,
      -1,
      origin.batch.lotId,
      tx,
    );

    if (!result.isSuccess) {
      return { success: true, data: { status: false, message: result.message } };
    }


      const batch = await tx.operationBatch.create({
        data: {
        actionNum:1,
        teamId: origin.batch.teamId,
        reagentId: origin.batch.reagentId,
        lotId: origin.batch.lotId,
        userId: session.userId,
        action: OperationAction.Outbound,
        note: normalizedNote || '快速出库',
        reagentNameSnapshot:origin.batch.reagentNameSnapshot || origin.batch.reagent.name,
        lotNameSnapshot: origin.batch.lotNameSnapshot || origin.batch.lot.name,
        userNameSnapshot: session.userName ?? '未知用户',
      }
    });
    
    await tx.operationItem.create({
      data: {
        batchId: batch.id,
        barcodeNumber: origin.barcodeNumber,
        udi: origin.udi,
        status: Status.Enable,
      },
    });

    return { success: true, data: { status:result.isSuccess, message: result.message } };
  }

  async outbound(
    dto: OperationDto['requestOutbound'],
    session: SessionUser,
    tx: Prisma.TransactionClient,
  ): Promise<OperationDto['responseOutbound']> {
    // 普通出库：先逐项校验库存，再为成功项写批次和明细，失败项仅返回提示。
    if (dto.outboundList.length === 0) {
      return { success: true, data: [{ isSuccess: false, message: '出库列表不能为空' }] };
    }
    const reagentIds = [...new Set(dto.outboundList.map((item) => item.reagentId))];
    const lotIds = [...new Set(dto.outboundList.map((item) => item.lotId))];
    const [reagentMap, lotMap] = await Promise.all([
      this.loadReagentMap(reagentIds),
      this.loadLotMap(lotIds),
    ]);

    const inventoryResults = await Promise.all(
      dto.outboundList.map(async (item) => {
        return await this.inventoryService.updateInventory(
          item.reagentId,
          -item.number,
          item.lotId,
          tx,
        );
      }),
    );

    const filterOutboundList = dto.outboundList.filter((_, i) => inventoryResults[i].isSuccess);
    const validCount = filterOutboundList.reduce((sum, item) => sum + item.number, 0);

    if (validCount > 0) {
      let nextBarcodeId = await this.reserveBarcodeRange(validCount, tx);

      for (const item of filterOutboundList) {
        const batch = await tx.operationBatch.create({
          data: {
            actionNum: item.number,
            teamId: session.teamId,
            reagentId: item.reagentId,
            lotId: item.lotId,
            userId: session.userId,
            action: OperationAction.Outbound,
            note: String(item.note ?? ''),
            reagentNameSnapshot: reagentMap.get(item.reagentId) ?? '',
            lotNameSnapshot: lotMap.get(item.lotId) ?? '',
            userNameSnapshot: session.userName ?? '未知用户',
          },
        });
        const itemsData: Prisma.OperationItemCreateManyInput[] = [];
        for (let j = 0; j < item.number; j++) {
          itemsData.push({
            batchId: batch.id,
            barcodeNumber: this.encodeBarcode(nextBarcodeId + BigInt(j)),
            udi: randomUUID(),
            status: Status.Enable,
          });
        }
        await tx.operationItem.createMany({ data: itemsData });
        nextBarcodeId += BigInt(item.number);
      }
    }

    return {
      success: true,
      data: inventoryResults,
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
        orderBy: [{ createdAt: 'desc' }],
      }),
      this.prisma.operationBatch.count({ where }),
    ]);


    const rows = batches.map((batch) => ({  
      user: { id: batch.userId, userName: batch.userNameSnapshot ?? '未知用户' },
      id: batch.id,
      createdAt: batch.createdAt,
      reagentId: batch.reagentId,
      lotId: batch.lotId,
      actionNum: batch.actionNum,
      note: batch.note,
      action: batch.action,
      status: batch.status,
      reagentNameSnapshot: batch.reagentNameSnapshot,
      lotNameSnapshot: batch.lotNameSnapshot,
      userNameSnapshot: batch.userNameSnapshot,
    }));

    const totalPage = Math.ceil(total / pageSize);

    return { success: true, data: rows, meta: { total, page, pageSize, totalPage } };
  }
  async showDetail(
    dto: OperationDto['requestShowDetail'],
    _session: SessionUser,
  ): Promise<OperationDto['responseShowDetail']> {
    // 该接口仅返回明细数据，供导出使用。
    const page = dto.page || 1;
    const pageSize = dto.pageSize || 10;
    const where: Prisma.OperationItemWhereInput = {
      batchId: dto.batchId,
    };
    if (dto.barcodeNumber) {
      where.barcodeNumber = { contains: dto.barcodeNumber };
    }
    if (dto.udi) {
      where.udi = { contains: dto.udi };
    }

    const [items, total] = await Promise.all([
      this.prisma.operationItem.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ id: 'asc' }],
        include: {batch: {
          select: {
            reagentNameSnapshot: true,
            lotNameSnapshot: true,
          }
        }}
      }),
      this.prisma.operationItem.count({ where }),
    ]);



    return { success: true, data: items, meta: { total, page, pageSize, totalPage: Math.ceil(total / pageSize) } };
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
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        include: {
            reagent: { select: { id: true, name: true } },
            lot: { select: { id: true, name: true } },
                  },
      }),
      this.prisma.operationBatch.count({ where }),
    ]);

    const rows = batches.map((batch) => ({  
      user: { id: batch.userId, userName: batch.userNameSnapshot ?? '未知用户' },
      userNameSnapshot: batch.userNameSnapshot ?? '未知用户',
      ...batch
    }));

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
