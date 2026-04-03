import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MangerPrismaService } from '../prisma/manger-prisma.service';
import { InventoryDto } from './inventory.dto';
import { InventoryWarningType, OperationAction, Status } from '../common/enums/enums';
import { SessionUser } from '../common/decorators/session-user.decorator';
import type { Prisma } from '../../generated/prisma-manger/client';

@Injectable()
export class InventoryService {
  // 注入库存业务所需的业务库 Prisma 实例。
  constructor(private readonly prisma: MangerPrismaService) {}

  // ===== 01. 基础规则计算 =====
  // 01-01 试剂行状态计算：仅由试剂状态决定。
  private resolveInventoryReagentRowStatus(reagentStatus: number): number {
    if (reagentStatus === Status.Delete) return Status.Delete;
    if (reagentStatus === Status.Disable) return Status.Disable;
    return Status.Enable;
  }

  // 01-02 批号行状态计算：仅由批号状态决定。
  private resolveInventoryLotRowStatus(lotStatus: number): number {
    if (lotStatus === Status.Delete) return Status.Delete;
    if (lotStatus === Status.Disable) return Status.Disable;
    return Status.Enable;
  }

  // 01-03 试剂行预警计算：仅区分无预警/数量预警。
  private resolveReagentWarn(number: number, warnNumber: number): number {
    return number <= warnNumber
      ? InventoryWarningType.NumberWarning
      : InventoryWarningType.NoWarning;
  }

  // 01-04 批号行预警计算：仅区分无预警/效期预警。
  private resolveLotWarn(expirationDate: Date, warnDays: number): number {
    const threshold = new Date();
    threshold.setHours(0, 0, 0, 0);
    threshold.setDate(threshold.getDate() + warnDays);
    return expirationDate <= threshold
      ? InventoryWarningType.ExpirationDateWarning
      : InventoryWarningType.NoWarning;
  }

  // ===== 02. 批号行预警与状态维护（内部工具） =====
  // 02-01 更新单个批号行的 warn/status。
  private async updateInventoryLotRowWarningAndStatusById(
    inventoryLotId: number,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const row = await tx.inventoryLot.findFirst({
      where: { id: inventoryLotId, status: { not: Status.Delete } },
      include: {
        reagent: { select: { warnDays: true, status: true } },
        lot: { select: { expirationDate: true, status: true } },
      },
    });
    if (!row) return;

    const warn = this.resolveLotWarn(row.lot.expirationDate, row.reagent.warnDays);
    const status = this.resolveInventoryLotRowStatus(row.lot.status);
    await tx.inventoryLot.update({
      where: { id: row.id },
      data: { warn, status },
    });
  }

  // 02-02 按试剂批量更新批号行的 warn/status。
  private async updateInventoryLotRowsWarningAndStatusByReagent(
    params: { teamId: number; reagentId: number },
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const rows = await tx.inventoryLot.findMany({
      where: {
        teamId: params.teamId,
        reagentId: params.reagentId,
        status: { not: Status.Delete },
      },
      include: {
        reagent: { select: { warnDays: true, status: true } },
        lot: { select: { expirationDate: true, status: true } },
      },
    });

    for (const row of rows) {
      const warn = this.resolveLotWarn(row.lot.expirationDate, row.reagent.warnDays);
      const status = this.resolveInventoryLotRowStatus(row.lot.status);
      await tx.inventoryLot.update({
        where: { id: row.id },
        data: { warn, status },
      });
    }
  }

  // ===== 03. 核心写入：增加与更新库存行 =====
  // 03-01 增加库存表中的试剂行：确保父行存在，并立即回写汇总与预警。
  public async addInventoryReagentRow(
    params: {
      reagentId: number;
      teamId: number;
    },
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    // 新增库存父行（试剂行）并刷新父层汇总与预警状态。
    const { reagentId, teamId } = params;
    const reagent = await tx.reagent.findFirst({
      where: { id: reagentId },
      select: { id: true, teamId: true },
    });
    if (!reagent) throw new HttpException('不存在的试剂id', HttpStatus.FORBIDDEN);
    if (reagent.teamId !== teamId) {
      throw new HttpException('试剂不属于当前团队', HttpStatus.FORBIDDEN);
    }

    await tx.inventoryReagent.upsert({
      where: { teamId_reagentId: { teamId, reagentId } },
      create: {
        teamId,
        reagentId,
        number: 0,
        status: Status.Enable,
        warn: InventoryWarningType.NoWarning,
      },
      update: {},
    });
    await this.updateInventoryReagentRow({ teamId, reagentId }, tx);
  }

  // 03-02 增加库存表中的批号行：创建/恢复子行，并联动更新父行。
  public async addInventoryLotRow(
    params: {
      reagentId: number;
      lotId: number;
      teamId: number;
      number?: number;
    },
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    // 新增库存子行（批号行）并联动刷新父层汇总与预警状态。
    const { reagentId, lotId, teamId, number = 0 } = params;
    const lot = await tx.lot.findFirst({
      where: { id: lotId },
      select: { id: true, reagentId: true },
    });
    if (!lot) throw new HttpException('不存在的批号id', HttpStatus.FORBIDDEN);
    if (lot.reagentId !== reagentId) {
      throw new HttpException('批号不属于该试剂', HttpStatus.FORBIDDEN);
    }

    const exists = await tx.inventoryLot.findFirst({
      where: { teamId, reagentId, lotId },
      select: { id: true, status: true },
    });

    if (exists && exists.status !== Status.Delete) {
      throw new HttpException('库存记录已存在', HttpStatus.FORBIDDEN);
    }

    await this.addInventoryReagentRow({ teamId, reagentId }, tx);

    if (exists && exists.status === Status.Delete) {
      // 软删记录复用，避免重复建行。
      await tx.inventoryLot.update({
        where: { id: exists.id },
        data: {
          teamId,
          reagentId,
          lotId,
          number,
          status: Status.Enable,
        },
      });
      await this.updateInventoryLotRowWarningAndStatusById(exists.id, tx);
    } else {
      const created = await tx.inventoryLot.create({
        data: {
          teamId,
          reagentId,
          lotId,
          number,
          status: Status.Enable,
          warn: InventoryWarningType.NoWarning,
        },
        select: { id: true },
      });
      await this.updateInventoryLotRowWarningAndStatusById(created.id, tx);
    }

    await this.updateInventoryReagentRow({ teamId, reagentId }, tx);
  }

  // 03-03 更新库存表中的试剂行：汇总子行数量并回写 warn/status。
  public async updateInventoryReagentRow(
    params: { teamId: number; reagentId: number },
    tx: Prisma.TransactionClient,
  ): Promise<number> {
    const reagent = await tx.reagent.findFirst({
      where: { id: params.reagentId },
      select: { id: true, warnNumber: true, status: true },
    });
    if (!reagent) return InventoryWarningType.NoWarning;

    const total = (
      await tx.inventoryLot.aggregate({
        where: {
          teamId: params.teamId,
          reagentId: params.reagentId,
          status: { not: Status.Delete },
        },
        _sum: { number: true },
      })
    )._sum.number ?? 0;

    const warn = this.resolveReagentWarn(total, reagent.warnNumber);
    const status = this.resolveInventoryReagentRowStatus(reagent.status);

    await tx.inventoryReagent.upsert({
      where: { teamId_reagentId: { teamId: params.teamId, reagentId: params.reagentId } },
      create: {
        teamId: params.teamId,
        reagentId: params.reagentId,
        number: total,
        warn,
        status,
      },
      update: {
        number: total,
        warn,
        status,
      },
    });
    return warn;
  }

  // 03-04 更新库存表中的批号行：更新子行并同步刷新新旧父行汇总。
  public async updateInventoryLotRow(
    params: {
      id: number;
      reagentId: number;
      lotId: number;
      teamId: number;
      number?: number;
    },
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    // 更新库存子行并联动刷新父层汇总与预警状态。
    const { id, reagentId, lotId, teamId, number = 0 } = params;
    const exists = await tx.inventoryLot.findFirst({
      where: { id, status: { not: Status.Delete } },
      select: { id: true, reagentId: true, teamId: true },
    });
    if (!exists) throw new HttpException('不存在的库存记录', HttpStatus.FORBIDDEN);

    const lot = await tx.lot.findFirst({
      where: { id: lotId },
      select: { id: true, reagentId: true },
    });
    if (!lot) throw new HttpException('不存在的批号id', HttpStatus.FORBIDDEN);
    if (lot.reagentId !== reagentId) {
      throw new HttpException('批号不属于该试剂', HttpStatus.FORBIDDEN);
    }

    const duplicate = await tx.inventoryLot.findFirst({
      where: {
        id: { not: id },
        teamId,
        reagentId,
        lotId,
        status: { not: Status.Delete },
      },
      select: { id: true },
    });
    if (duplicate) throw new HttpException('库存记录已存在', HttpStatus.FORBIDDEN);

    await this.addInventoryReagentRow({ teamId, reagentId }, tx);

    await tx.inventoryLot.update({
      where: { id },
      data: {
        teamId,
        reagentId,
        lotId,
        number,
      },
    });

    await this.updateInventoryLotRowWarningAndStatusById(id, tx);
    // 若批号归属试剂变化，需要同时刷新新旧两个父节点。
    await this.updateInventoryReagentRow({ teamId, reagentId }, tx);
    await this.updateInventoryReagentRow({
      teamId: exists.teamId,
      reagentId: exists.reagentId,
    }, tx);
  }

  // 03-05 按操作增量更新库存：供入库/出库等业务统一调用。
  public async updateInventory(
    reagentId: number,
    delta: number,
    lotId: number | undefined,
    tx: Prisma.TransactionClient,
  ): Promise<{ isSuccess: boolean; message: string }> {
    const reagent = await tx.reagent.findFirst({
      where: { id: reagentId },
      select: { id: true, name: true, teamId: true, warnNumber: true },
    });
    if (!reagent) return { isSuccess: false, message: '试剂不存在' };

    await this.addInventoryReagentRow({ teamId: reagent.teamId, reagentId }, tx);

    if (lotId !== undefined) {
      const lot = await tx.lot.findFirst({
        where: { id: lotId, reagentId },
        select: { id: true },
      });
      if (!lot) return { isSuccess: false, message: '库存记录不存在' };

      const lotRow = await tx.inventoryLot.upsert({
        where: {
          teamId_reagentId_lotId: {
            teamId: reagent.teamId,
            reagentId,
            lotId,
          },
        },
        create: {
          teamId: reagent.teamId,
          reagentId,
          lotId,
          number: 0,
          status: Status.Enable,
          warn: InventoryWarningType.NoWarning,
        },
        update: {},
        select: { id: true, number: true },
      });

      if (delta < 0 && lotRow.number + delta < 0) {
        return { isSuccess: false, message: `${reagent.name}库存不足` };
      }

      if (delta !== 0) {
        await tx.inventoryLot.update({
          where: { id: lotRow.id },
          data: { number: { increment: delta } },
        });
      }

      await this.updateInventoryLotRowWarningAndStatusById(lotRow.id, tx);
    }

    if (lotId === undefined) {
      // delta=0 且 lot 未指定时，用于仅刷新 warn/status。
      await this.updateInventoryLotRowsWarningAndStatusByReagent(
        { teamId: reagent.teamId, reagentId },
        tx,
      );
    }

    const warn = await this.updateInventoryReagentRow(
      { teamId: reagent.teamId, reagentId },
      tx,
    );
    if (warn === InventoryWarningType.NumberWarning) {
      return { isSuccess: true, message: `${reagent.name}库存达到警告线` };
    }
    return { isSuccess: true, message: `${reagent.name}库存更新成功` };
  }

  // ===== 04. 维护与修复 =====
  // 04-01 批量刷新批号行效期预警（可指定单 lot）。
  public async updateExpirationWarning(
    lotId: number | undefined,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const rows = await tx.inventoryLot.findMany({
      where:
        lotId !== undefined
          ? { lotId, status: { not: Status.Delete } }
          : { status: { not: Status.Delete } },
      include: {
        reagent: { select: { warnDays: true, status: true } },
        lot: { select: { expirationDate: true, status: true } },
      },
    });

    for (const row of rows) {
      const warn = this.resolveLotWarn(row.lot.expirationDate, row.reagent.warnDays);
      const status = this.resolveInventoryLotRowStatus(row.lot.status);
      await tx.inventoryLot.update({
        where: { id: row.id },
        data: { warn, status },
      });
    }
  }

  // 04-02 按库存行 ID 重算批号数量，并回写试剂行汇总。
  public async recalculateInventoryNumbersByInventoryIds(
    inventoryIds: number[],
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const uniqueIds = [...new Set(inventoryIds.filter((id) => Number.isInteger(id) && id > 0))];
    if (uniqueIds.length === 0) return;

    const inventories = await tx.inventoryLot.findMany({
      where: { id: { in: uniqueIds }, status: { not: Status.Delete } },
      select: { id: true, reagentId: true, lotId: true, teamId: true },
    });

    const affectedReagentKeys = new Set<string>();

    for (const inv of inventories) {
      const [inbound, outbound] = await Promise.all([
        tx.operationItem.count({
          where: {
            status: Status.Enable,
            batch: {
              teamId: inv.teamId,
              reagentId: inv.reagentId,
              lotId: inv.lotId,
              action: OperationAction.Inbound,
              status: Status.Enable,
            },
          },
        }),
        tx.operationItem.count({
          where: {
            status: Status.Enable,
            batch: {
              teamId: inv.teamId,
              reagentId: inv.reagentId,
              lotId: inv.lotId,
              action: OperationAction.Outbound,
              status: Status.Enable,
            },
          },
        }),
      ]);

      await tx.inventoryLot.update({
        where: { id: inv.id },
        data: { number: inbound - outbound },
      });
      await this.updateInventoryLotRowWarningAndStatusById(inv.id, tx);
      affectedReagentKeys.add(`${inv.teamId}-${inv.reagentId}`);
    }

    for (const key of affectedReagentKeys) {
      const [teamIdStr, reagentIdStr] = key.split('-');
      await this.updateInventoryReagentRow(
        { teamId: Number(teamIdStr), reagentId: Number(reagentIdStr) },
        tx,
      );
    }
  }

  // ===== 05. 查询与树结构组装 =====
  // 05-01 构建库存父行查询条件（试剂维度）。
  private buildInventoryReagentWhere(name: string | undefined) {
    const where: Prisma.InventoryReagentWhereInput = {
      status: { not: Status.Delete },
      reagent: {
        is: {
          status: { not: Status.Delete },
        },
      },
    };
    if (name) {
      where.reagent = {
        is: {
          status: { not: Status.Delete },
          name: { contains: name },
        },
      };
    }
    return where;
  }

  // 05-02 将父子表数据组装为前端树形结构。
  private mapTreeRows(
    parents: Array<{
      id: number;
      teamId: number;
      reagentId: number;
      number: number;
      status: number;
      warn: number;
      reagent: { id: number; name: string; specifications: string; warnNumber: number; status: number };
    }>,
    lots: Array<{
      id: number;
      teamId: number;
      reagentId: number;
      lotId: number;
      number: number;
      status: number;
      warn: number;
      reagent: { id: number; name: string; specifications: string; warnNumber: number; status: number };
      lot: { id: number; name: string; expirationDate: Date; status: number };
    }>,
  ): InventoryDto['responseShow']['data'] {
    const lotMap = new Map<number, InventoryDto['responseShow']['data'][number][]>();

    for (const lot of lots) {
      const lotStatus = this.resolveInventoryLotRowStatus(lot.lot.status);
      const child: InventoryDto['responseShow']['data'][number] = {
        id: `lot-${lot.id}`,
        nodeType: 'lot',
        reagentId: lot.reagentId,
        lotId: lot.lotId,
        reagentName: lot.reagent.name,
        lotName: lot.lot.name,
        name: lot.lot.name,
        number: lot.number,
        specifications: lot.reagent.specifications,
        lotExpirationDate: lot.lot.expirationDate,
        warnNumber: lot.reagent.warnNumber,
        warn: lot.warn,
        status: lotStatus,
      };
      const current = lotMap.get(lot.reagentId);
      if (current) {
        current.push(child);
      } else {
        lotMap.set(lot.reagentId, [child]);
      }
    }

    return parents.map((parent) => ({
      id: `reagent-${parent.id}`,
      nodeType: 'reagent',
      reagentId: parent.reagentId,
      lotId: null,
      reagentName: parent.reagent.name,
      lotName: '',
      name: parent.reagent.name,
      number: parent.number,
      specifications: parent.reagent.specifications,
      lotExpirationDate: null,
      warnNumber: parent.reagent.warnNumber,
      warn: parent.warn,
      status: parent.reagent.status,
      children: lotMap.get(parent.reagentId) ?? [],
    }));
  }

  // 05-03 分页查询库存树（分页作用于试剂父行）。
  async show(
    dto: InventoryDto['requestShow'],
    _session: SessionUser,
  ): Promise<InventoryDto['responseShow']> {
    const where = this.buildInventoryReagentWhere(dto.name);
    const page = dto.page || 1;
    const pageSize = dto.pageSize || 10;

    const [parents, total] = await Promise.all([
      this.prisma.inventoryReagent.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ warn: 'desc' }, { id: 'desc' }],
        include: {
          reagent: { select: { id: true, name: true, specifications: true, warnNumber: true, status: true } },
        },
      }),
      this.prisma.inventoryReagent.count({ where }),
    ]);

    const reagentIds = [...new Set(parents.map((p) => p.reagentId))];
    const lots =
      reagentIds.length === 0
        ? []
        : await this.prisma.inventoryLot.findMany({
            where: {
              status: { not: Status.Delete },
              reagentId: { in: reagentIds },
              reagent: { status: { not: Status.Delete } },
              lot: { status: { not: Status.Delete } },
            },
            orderBy: [{ reagentId: 'asc' }, { lotId: 'asc' }],
            include: {
              reagent: { select: { id: true, name: true, specifications: true, warnNumber: true, status: true } },
              lot: { select: { id: true, name: true, expirationDate: true, status: true } },
            },
          });

    const totalPage = Math.ceil(total / pageSize);
    return {
      success: true,
      data: this.mapTreeRows(parents, lots),
      meta: { total, page, pageSize, totalPage },
    };
  }

  // 05-04 查询库存树（导出场景，不限制 pageSize）。
  async showAll(
    dto: InventoryDto['requestShowAll'],
    _session: SessionUser,
  ): Promise<InventoryDto['responseShowAll']> {
    const where = this.buildInventoryReagentWhere(dto.name);
    const page = dto.page || 1;
    const pageSize = dto.pageSize || 9999999;

    const [parents, total] = await Promise.all([
      this.prisma.inventoryReagent.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ warn: 'desc' }, { id: 'desc' }],
        include: {
          reagent: { select: { id: true, name: true, specifications: true, warnNumber: true, status: true } },
        },
      }),
      this.prisma.inventoryReagent.count({ where }),
    ]);

    const reagentIds = [...new Set(parents.map((p) => p.reagentId))];
    const lots =
      reagentIds.length === 0
        ? []
        : await this.prisma.inventoryLot.findMany({
            where: {
              status: { not: Status.Delete },
              reagentId: { in: reagentIds },
              reagent: { status: { not: Status.Delete } },
              lot: { status: { not: Status.Delete } },
            },
            orderBy: [{ reagentId: 'asc' }, { lotId: 'asc' }],
            include: {
              reagent: { select: { id: true, name: true, specifications: true, warnNumber: true, status: true } },
              lot: { select: { id: true, name: true, expirationDate: true, status: true } },
            },
          });

    const totalPage = Math.ceil(total / pageSize);
    return {
      success: true,
      data: this.mapTreeRows(parents, lots),
      meta: { total, page, pageSize, totalPage },
    };
  }

  // ===== 06. 审计与统计 =====
  // 06-01 全量审计库存：按操作明细回放批号库存并重建汇总。
  async auditAll(
    session: SessionUser,
    tx: Prisma.TransactionClient,
  ): Promise<InventoryDto['responseAuditAll']> {
    const inventories = await tx.inventoryLot.findMany({
      where: {
        teamId: session.teamId,
        status: { not: Status.Delete },
      },
      select: { id: true, teamId: true, reagentId: true, lotId: true },
    });

    const affectedReagentIds = new Set<number>();
    for (const inv of inventories) {
      const [inbound, outbound] = await Promise.all([
        tx.operationItem.count({
          where: {
            status: Status.Enable,
            batch: {
              teamId: inv.teamId,
              reagentId: inv.reagentId,
              lotId: inv.lotId,
              action: OperationAction.Inbound,
              status: Status.Enable,
            },
          },
        }),
        tx.operationItem.count({
          where: {
            status: Status.Enable,
            batch: {
              teamId: inv.teamId,
              reagentId: inv.reagentId,
              lotId: inv.lotId,
              action: OperationAction.Outbound,
              status: Status.Enable,
            },
          },
        }),
      ]);

      await tx.inventoryLot.update({
        where: { id: inv.id },
        data: { number: inbound - outbound },
      });
      await this.updateInventoryLotRowWarningAndStatusById(inv.id, tx);
      affectedReagentIds.add(inv.reagentId);
    }

    for (const reagentId of affectedReagentIds) {
      await this.updateInventoryReagentRow(
        { teamId: session.teamId, reagentId },
        tx,
      );
    }

    return { success: true, data: { message: '库存修正完成' } };
  }

  // 06-02 按时间窗口统计库存/入库/出库趋势。
  async statistics(
    dto: InventoryDto['requestStatistics'],
    session: SessionUser,
  ): Promise<InventoryDto['responseStatistics']> {
    const onlyLot = dto.onlyLot === true;
    const reagent = await this.prisma.reagent.findFirst({ where: { id: dto.reagentId } });
    if (!reagent) throw new HttpException('不存在的试剂id', HttpStatus.FORBIDDEN);

    if (onlyLot) {
      if (!dto.lotId) throw new HttpException('仅批号统计时必须提供lotId', HttpStatus.FORBIDDEN);
      const lot = await this.prisma.lot.findFirst({ where: { id: dto.lotId } });
      if (!lot) throw new HttpException('不存在的批号id', HttpStatus.FORBIDDEN);
    }

    if (dto.startTime >= dto.endTime) {
      throw new HttpException('开始时间不能晚于结束时间', HttpStatus.FORBIDDEN);
    }

    const batchLotFilter = onlyLot && dto.lotId ? { lotId: dto.lotId } : {};

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
        this.prisma.operationItem.count({
          where: {
            status: Status.Enable,
            batch: {
              teamId: session.teamId,
              reagentId: dto.reagentId,
              ...batchLotFilter,
              action: OperationAction.Inbound,
              status: Status.Enable,
              createTime: timeRange,
            },
          },
        }),
        this.prisma.operationItem.count({
          where: {
            status: Status.Enable,
            batch: {
              teamId: session.teamId,
              reagentId: dto.reagentId,
              ...batchLotFilter,
              action: OperationAction.Outbound,
              status: Status.Enable,
              createTime: timeRange,
            },
          },
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
