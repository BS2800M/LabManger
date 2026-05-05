import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MangerPrismaService } from '../prisma/manger-prisma.service';
import { InventoryDto } from './inventory.dto';
import { Status } from '../common/enums/enums';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { Prisma } from '../../generated/prisma-manger/client';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: MangerPrismaService) {}

  public async updateInventory(
    reagentId: number,
    delta: number,
    lotId: number ,
    tx: Prisma.TransactionClient,
    options: { allowExpiringInbound: boolean ,allowNegativeInventory: boolean } = {allowExpiringInbound: false,allowNegativeInventory: false},
  ): Promise<{ isSuccess: boolean; message: string }> {
    const reagent = await tx.reagent.findFirst({
      where: { id: reagentId, status: { not: Status.Delete } },
      select: { id: true, name: true, number: true },
    });
    if (!reagent) return { isSuccess: false, message: '试剂不存在' };

    const lot = await tx.lot.findFirst({
      where: {
        id: lotId,
        reagentId,
        status: { not: Status.Delete },
      },
      select: { id: true, number: true, warningDate: true,name: true },
    });
    if (!lot) return { isSuccess: false, message: '批号不存在' };

    const now = new Date();
    if (delta > 0 && options.allowExpiringInbound !== true && now > lot.warningDate) {
      return { isSuccess: false, message: `试剂${reagent.name}的批号${lot.name}临期为${lot.warningDate.toLocaleDateString()}，禁止入库` };
    }

    if (delta < 0 && options.allowNegativeInventory !== true) {
      if (lot.number + delta < 0 || reagent.number + delta < 0) {
        return { isSuccess: false, message: `试剂${reagent.name}的批号${lot.name}目前库存为${lot.number},出库数量${-delta}，库存不足，禁止出库` };
      }
    }
    await tx.lot.update({
      where: { id: lot.id },
      data: {
        number: { increment: delta },
        ...(delta < 0 ? { updatedAt: now } : {}),
      },
    });
    await tx.reagent.update({
      where: { id: reagentId },
      data: {
        number: { increment: delta },
        ...(delta < 0 ? { updatedAt: now } : {}),
      },
    });
    return { isSuccess: true, message: `试剂${reagent.name}的批号${lot.name}库存更新成功,试剂库存为${reagent.number + delta}` };
  }

  async showReagent(
    dto: InventoryDto['requestShowReagent'],
    _session: SessionUser,
  ): Promise<InventoryDto['responseShowReagent']> {
    const page = dto.page || 1;
    const pageSize = dto.pageSize || 10;
    const where: Prisma.ReagentWhereInput = {
      status: { not: Status.Delete },
      ...(dto.name ? { name: { contains: dto.name } } : {}),
      ...(dto.lowStockOnly
        ? {
            number: {
              lte: this.prisma.reagent.fields.warnNumber,
            },
          }
        : {}),
    };

    const [rows, total] = await Promise.all([
      this.prisma.reagent.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        select: {
          id: true,
          name: true,
          specifications: true,
          number: true,
          warnNumber: true,
          status: true,
          updatedAt: true,
        },
      }),
      this.prisma.reagent.count({ where }),
    ]);

    const totalPage = Math.ceil(total / pageSize);
    return {
      success: true,
      data: rows,
      meta: { total, page, pageSize, totalPage },
    };
  }

  async showLot(
    dto: InventoryDto['requestShowLot'],
    _session: SessionUser,
  ): Promise<InventoryDto['responseShowLot']> {
    const page = dto.page || 1;
    const pageSize = dto.pageSize || 10;
    const skip = (page - 1) * pageSize;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const where: Prisma.LotWhereInput = {
      status: { not: Status.Delete },
      reagentId: dto.reagentId,
      reagent: { status: { not: Status.Delete } },
      ...(dto.lot ? { name: { contains: dto.lot } } : {}),
      ...(dto.expiredOnly ? { warningDate: { lt: todayStart } } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.lot.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        select: {
          id: true,
          name: true,
          reagentId: true,
          expirationDate: true,
          warnDays: true,
          warningDate: true,
          number: true,
          warnNumber: true,
          status: true,
          updatedAt: true,
          reagent: { select: { name: true,id:true,number:true,warnNumber:true } },
        },
      }),
      this.prisma.lot.count({ where }),
    ]);
    const totalPage = Math.ceil(total / pageSize);
    return { success: true, data, meta: { total, page, pageSize, totalPage } };
  }
  async showAll(
    dto: InventoryDto['requestShowAll'],
    _session: SessionUser,
  ): Promise<InventoryDto['responseShowAll']> {
    const where: Prisma.LotWhereInput = {
      status: { not: Status.Delete },
      reagent: { status: { not: Status.Delete } },
      ...(dto.lot ? { name: { contains: dto.lot } } : {}),
    };
    const page = dto.page || 1;
    const pageSize = dto.pageSize || 10;
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      this.prisma.lot.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ updatedAt: 'desc' }, { reagentId: 'desc' }],
        select: {
          id: true,
          name: true,
          reagentId: true,
          expirationDate: true,
          warnDays: true,
          warningDate: true,
          number: true,
          warnNumber: true,
          status: true,
          updatedAt: true,
          reagent: { select: { name: true,id:true,number:true,warnNumber:true } },
        },
      }),
      this.prisma.lot.count({ where }),
    ]);

    const totalPage = Math.ceil(total / pageSize);
    return {
      success: true,
      data,
      meta: { total, page, pageSize, totalPage },
    };
  }
}



