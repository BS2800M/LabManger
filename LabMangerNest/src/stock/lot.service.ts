import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MangerPrismaService } from '../prisma/manger-prisma.service';
import { InventoryService } from './inventory.service';
import { LotDto } from './lot.dto';
import { Status } from '../common/enums/enums';
import { SessionUser } from '../common/decorators/session-user.decorator';

@Injectable()
export class LotService {
    constructor(
        private readonly prisma: MangerPrismaService,
        private readonly inventoryService: InventoryService,
    ) { }

    // 批号状态聚合规则：任一删除 -> 删除；否则任一停用 -> 停用；否则启用
    private resolveLotStatus(lotStatus: number, reagentStatus: number): number {
        if (lotStatus === Status.Delete || reagentStatus === Status.Delete) return Status.Delete;
        if (lotStatus === Status.Disable || reagentStatus === Status.Disable) return Status.Disable;
        return Status.Enable;
    }

    async add(dto: LotDto['requestAdd'], session: SessionUser): Promise<LotDto['responseAdd']> {
        const reagent = await this.prisma.reagent.findFirst({ where: { id: dto.reagentId } });
        if (!reagent) {
            throw new HttpException('不存在的试剂id', HttpStatus.FORBIDDEN);
        }

        const lot = await this.prisma.lot.create({
            data: {
                name: dto.name,
                reagentId: dto.reagentId,
                expirationDate: dto.expirationDate,
                teamId: reagent.teamId,
            },
            include: { reagent: { select: { id: true, name: true } } },
        });

        await this.inventoryService.add({
            reagentId: lot.reagentId,
            lotId: lot.id,
            teamId: lot.teamId,
            number: 0,
        });

        return {
            success: true,
            data: lot,
        };
    }

    async show(dto: LotDto['requestShow'], session: SessionUser): Promise<LotDto['responseShow']> {
        const where: any = {
            status: { not: Status.Delete },
            reagent: { status: { not: Status.Delete } },
        };
        if (dto.name) { where.name = { contains: dto.name }; }

        const page = dto.page || 1;
        const pageSize = dto.pageSize || 10;

        const [lots, total] = await Promise.all([
            this.prisma.lot.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { id: 'desc' },
                include: { reagent: { select: { id: true, name: true, status: true } } },
            }),
            this.prisma.lot.count({ where }),
        ]);

        const lotsToReturn = lots.map((lot) => ({
            ...lot,
            status: this.resolveLotStatus(lot.status, lot.reagent.status),
        }));

        const totalPage = Math.ceil(total / pageSize);
        return {
            success: true,
            data: lotsToReturn,
            meta: { total, page, pageSize, totalPage },
        };
    }

    async update(dto: LotDto['requestUpdate'], session: SessionUser): Promise<LotDto['responseUpdate']> {
        const exists = await this.prisma.lot.findFirst({ where: { id: dto.id } });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }
        const reagent = await this.prisma.reagent.findFirst({ where: { id: dto.reagentId } });
        if (!reagent) {
            throw new HttpException('不存在的试剂id', HttpStatus.FORBIDDEN);
        }
        const oldReagentId = exists.reagentId;
        const newReagentId = dto.reagentId;
        const reagentChanged = oldReagentId !== newReagentId;
        const inventoryRow = reagentChanged
            ? await this.prisma.inventory.findFirst({
                where: { lotId: dto.id, reagentId: oldReagentId, status: { not: Status.Delete } },
                select: { id: true, number: true },
            })
            : null;

        const lot = await this.prisma.$transaction(async (tx) => {
            const updatedLot = await tx.lot.update({
                where: { id: dto.id },
                data: {
                    name: dto.name,
                    reagentId: newReagentId,
                    expirationDate: dto.expirationDate,
                    status: dto.status,
                    teamId: reagent.teamId,
                },
                include: { reagent: { select: { id: true, name: true } } },
            });

            return updatedLot;
        });

        if (reagentChanged) {
            if (!inventoryRow) {
                throw new HttpException('不存在的库存记录', HttpStatus.FORBIDDEN);
            }
            // 批号改归属时，直接使用 inventoryService.update 迁移库存归属并刷新预警/库存
            await this.inventoryService.update({
                id: inventoryRow.id,
                reagentId: newReagentId,
                lotId: dto.id,
                teamId: reagent.teamId,
                number: inventoryRow.number,
            });
        } 
        return {
            success: true,
            data: lot,
        };
    }

    async del(dto: LotDto['requestDel'], session: SessionUser): Promise<LotDto['responseDel']> {
        const exists = await this.prisma.lot.findFirst({ where: { id: dto.id } });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }

        const lot = await this.prisma.lot.update({
            where: { id: dto.id },
            data: { status: Status.Delete },
            include: { reagent: { select: { id: true, name: true } } },
        });

        return {
            success: true,
            data: lot,
        };
    }

    async showAll(dto: LotDto['requestShowAll'], session: SessionUser): Promise<LotDto['responseShowAll']> {
        const where: any = {
            status: { not: Status.Delete },
            reagent: { status: { not: Status.Delete } },
        };
        if (dto.reagentId) { where.reagentId = dto.reagentId; }

        const lots = await this.prisma.lot.findMany({
            where,
            select: { id: true, name: true, status: true, reagent: { select: { status: true } } },
            orderBy: { id: 'asc' },

        });

        return {
            success: true,
            data: lots.map((lot) => ({
                id: lot.id,
                name: lot.name,
                status: this.resolveLotStatus(lot.status, lot.reagent.status),
            })),
        };
    }
}
