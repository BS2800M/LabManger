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

  // 状态聚合：删除优先级最高，其次停用，最后启用。
  private resolveInventoryStatus(reagentStatus: number, lotStatus: number): number {
    if (reagentStatus === Status.Delete || lotStatus === Status.Delete) return Status.Delete;
    if (reagentStatus === Status.Disable || lotStatus === Status.Disable) return Status.Disable;
    return Status.Enable;
  }

  // 父节点只允许 0/1（无预警/数量预警）。
  private resolveReagentWarn(number: number, warnNumber: number): number {
    return number <= warnNumber
      ? InventoryWarningType.NumberWarning
      : InventoryWarningType.NoWarning;
  }

  // 子节点只允许 0/2（无预警/效期预警）。
  private resolveLotWarn(expirationDate: Date, warnDays: number): number {
    const threshold = new Date();
    threshold.setHours(0, 0, 0, 0);
    threshold.setDate(threshold.getDate() + warnDays);
    return expirationDate <= threshold
      ? InventoryWarningType.ExpirationDateWarning
      : InventoryWarningType.NoWarning;
  }

  private async ensureInventoryReagentRow(
    params: { teamId: number; reagentId: number },
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    // 保证父层汇总行存在，后续更新可直接走 upsert/update。
    await tx.inventoryReagent.upsert({
      where: { teamId_reagentId: { teamId: params.teamId, reagentId: params.reagentId } },
      create: {
        teamId: params.teamId,
        reagentId: params.reagentId,
        number: 0,
        status: Status.Enable,
        warn: InventoryWarningType.NoWarning,
      },
      update: {},
    });
  }

  private async refreshReagentNumberWarnAndStatus(
    params: { teamId: number; reagentId: number },
    tx: Prisma.TransactionClient,
  ): Promise<number> {
    // 父层 number 由子层 sum 得出，但在写入路径同步落库，查询时不做临时聚合。
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
    const status =
      reagent.status === Status.Delete
        ? Status.Delete
        : reagent.status === Status.Disable
          ? Status.Disable
          : Status.Enable;

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

  private async refreshLotWarnAndStatusById(
    inventoryLotId: number,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    // 按单行刷新，适用于增减库存后的精确更新。
    const row = await tx.inventoryLot.findFirst({
      where: { id: inventoryLotId, status: { not: Status.Delete } },
      include: {
        reagent: { select: { warnDays: true, status: true } },
        lot: { select: { expirationDate: true, status: true } },
      },
    });
    if (!row) return;

    const warn = this.resolveLotWarn(row.lot.expirationDate, row.reagent.warnDays);
    const status = this.resolveInventoryStatus(row.reagent.status, row.lot.status);
    await tx.inventoryLot.update({
      where: { id: row.id },
      data: { warn, status },
    });
  }

  private async refreshLotWarnAndStatusByReagent(
    params: { teamId: number; reagentId: number },
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    // 按试剂批量刷新，适用于 warnDays 变更等“整试剂”场景。
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
      const status = this.resolveInventoryStatus(row.reagent.status, row.lot.status);
      await tx.inventoryLot.update({
        where: { id: row.id },
        data: { warn, status },
      });
    }
  }

  public async add(
    params: {
      reagentId: number;
      lotId: number;
      teamId: number;
      number?: number;
    },
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    // 新增库存子行并联动刷新父层汇总与预警状态。
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

    await this.ensureInventoryReagentRow({ teamId, reagentId }, tx);

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
      await this.refreshLotWarnAndStatusById(exists.id, tx);
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
      await this.refreshLotWarnAndStatusById(created.id, tx);
    }

    await this.refreshReagentNumberWarnAndStatus({ teamId, reagentId }, tx);
  }

  public async update(
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

    await this.ensureInventoryReagentRow({ teamId, reagentId }, tx);

    await tx.inventoryLot.update({
      where: { id },
      data: {
        teamId,
        reagentId,
        lotId,
        number,
      },
    });

    await this.refreshLotWarnAndStatusById(id, tx);
    // 若批号归属试剂变化，需要同时刷新新旧两个父节点。
    await this.refreshReagentNumberWarnAndStatus({ teamId, reagentId }, tx);
    await this.refreshReagentNumberWarnAndStatus({
      teamId: exists.teamId,
      reagentId: exists.reagentId,
    }, tx);
  }

  public async updateInventory(
    reagentId: number,
    delta: number,
    lotId: number | undefined,
    tx: Prisma.TransactionClient,
  ): Promise<{ isSuccess: boolean; message: string }> {
    // Operation 入/出/禁用补偿统一走这里，保证库存父子行同事务更新。
    const reagent = await tx.reagent.findFirst({
      where: { id: reagentId },
      select: { id: true, name: true, teamId: true, warnNumber: true },
    });
    if (!reagent) return { isSuccess: false, message: '试剂不存在' };

    await this.ensureInventoryReagentRow({ teamId: reagent.teamId, reagentId }, tx);

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

      await this.refreshLotWarnAndStatusById(lotRow.id, tx);
    }

    if (lotId === undefined) {
      // delta=0 且 lot 未指定时，用于仅刷新 warn/status。
      await this.refreshLotWarnAndStatusByReagent(
        { teamId: reagent.teamId, reagentId },
        tx,
      );
    }

    const warn = await this.refreshReagentNumberWarnAndStatus(
      { teamId: reagent.teamId, reagentId },
      tx,
    );
    if (warn === InventoryWarningType.NumberWarning) {
      return { isSuccess: true, message: `${reagent.name}库存达到警告线` };
    }
    return { isSuccess: true, message: `${reagent.name}库存更新成功` };
  }

  public async updateExpirationWarning(
    lotId: number | undefined,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    // 定时任务入口：批量刷新子层效期预警和状态。
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
      const status = this.resolveInventoryStatus(row.reagent.status, row.lot.status);
      await tx.inventoryLot.update({
        where: { id: row.id },
        data: { warn, status },
      });
    }
  }

  public async recalculateInventoryNumbersByInventoryIds(
    inventoryIds: number[],
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    // 兜底修复工具：基于 operation 明细回放 lot 数量，再回写父层汇总。
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
      await this.refreshLotWarnAndStatusById(inv.id, tx);
      affectedReagentKeys.add(`${inv.teamId}-${inv.reagentId}`);
    }

    for (const key of affectedReagentKeys) {
      const [teamIdStr, reagentIdStr] = key.split('-');
      await this.refreshReagentNumberWarnAndStatus(
        { teamId: Number(teamIdStr), reagentId: Number(reagentIdStr) },
        tx,
      );
    }
  }

  private buildInventoryReagentWhere(name: string | undefined) {
    // 展示查询仅过滤软删除和名称条件，不做 team 隔离。
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
    // 后端直接组装 el-table-v2 树形结构（父试剂 -> 子批号）。
    const lotMap = new Map<number, InventoryDto['responseShow']['data'][number][]>();

    for (const lot of lots) {
      const lotStatus = this.resolveInventoryStatus(lot.reagent.status, lot.lot.status);
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

  async show(
    dto: InventoryDto['requestShow'],
    _session: SessionUser,
  ): Promise<InventoryDto['responseShow']> {
    // 分页作用于父节点（试剂），子节点按父节点一次性拉取。
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

  async showAll(
    dto: InventoryDto['requestShowAll'],
    _session: SessionUser,
  ): Promise<InventoryDto['responseShowAll']> {
    // 导出接口复用 show 逻辑，但不限制 pageSize。
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

  async auditAll(
    session: SessionUser,
    tx: Prisma.TransactionClient,
  ): Promise<InventoryDto['responseAuditAll']> {
    // 全量校准：按 batch.action 回放入出库，重建 lot 数量。
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
      await this.refreshLotWarnAndStatusById(inv.id, tx);
      affectedReagentIds.add(inv.reagentId);
    }

    for (const reagentId of affectedReagentIds) {
      await this.refreshReagentNumberWarnAndStatus(
        { teamId: session.teamId, reagentId },
        tx,
      );
    }

    return { success: true, data: { message: '库存修正完成' } };
  }

  async statistics(
    dto: InventoryDto['requestStatistics'],
    session: SessionUser,
  ): Promise<InventoryDto['responseStatistics']> {
    // 统计口径基于 operation 明细 + batch 时间窗，保证与业务操作一致。
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
