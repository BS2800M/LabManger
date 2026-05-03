import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MangerPrismaService } from '../prisma/manger-prisma.service';
import { InventoryService } from './inventory.service';
import { LotDto } from './lot.dto';
import { Status } from '../common/enums/enums';
import { SessionUser } from '../common/decorators/session-user.decorator';
import type { Prisma } from '../../generated/prisma-manger/client';
import type { Status as PrismaStatus } from '../../generated/prisma-manger/enums';

@Injectable()
export class LotService {
    constructor(
        private readonly prisma: MangerPrismaService,
        private readonly inventoryService: InventoryService,
    ) { }

    private buildWarningDate(expirationDate: Date, warnDays: number): Date {
        const warningDate = new Date(expirationDate);
        warningDate.setDate(warningDate.getDate() - warnDays);
        return warningDate;
    }

    async add(
        dto: LotDto['requestAdd'],
        _session: SessionUser,
        tx: Prisma.TransactionClient,
    ): Promise<LotDto['responseAdd']> {
        const reagent = await tx.reagent.findFirst({ where: { id: dto.reagentId } });
        if (!reagent) {
            throw new HttpException('不存在的试剂id', HttpStatus.FORBIDDEN);
        }

        const lot = await tx.lot.create({
            data: {
                name: dto.name,
                reagentId: dto.reagentId,
                expirationDate: dto.expirationDate,
                warnDays: reagent.warnDays,
                warningDate: this.buildWarningDate(dto.expirationDate, reagent.warnDays),
                teamId: reagent.teamId,
            },
            include: { reagent: { select: { id: true, name: true } } },
        });


        return { success: true, data: { ...lot, status: lot.status as PrismaStatus } };
    }

    async show(dto: LotDto['requestShow'], session: SessionUser): Promise<LotDto['responseShow']> {
        const where: any = {
            status: { not: Status.Delete },
            reagentId: dto.reagentId,
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

        const totalPage = Math.ceil(total / pageSize);
        return {
            success: true,
            data: lots.map((lot) => ({ ...lot, status: lot.status as PrismaStatus })),
            meta: { total, page, pageSize, totalPage },
        };
    }

    async update(
        dto: LotDto['requestUpdate'],
        _session: SessionUser,
        tx: Prisma.TransactionClient,
    ): Promise<LotDto['responseUpdate']> {
        const exists = await tx.lot.findFirst({ where: { id: dto.id } });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }
        const reagent = await tx.reagent.findFirst({ where: { id: dto.reagentId } });
        if (!reagent) {
            throw new HttpException('不存在的试剂id', HttpStatus.FORBIDDEN);
        }
        const oldReagentId = exists.reagentId;
        const newReagentId = dto.reagentId;

        const lot = await tx.lot.update({
            where: { id: dto.id },
            data: {
                name: dto.name,
                reagentId: newReagentId,
                expirationDate: dto.expirationDate,
                warnDays: dto.warnDays,
                warningDate: this.buildWarningDate(dto.expirationDate, dto.warnDays),
                status: dto.status,
                teamId: reagent.teamId,
            },
            include: { reagent: { select: { id: true, name: true } } },
        });



        return { success: true, data: { ...lot, status: lot.status as PrismaStatus } };
    }

    async del(
        dto: LotDto['requestDel'],
        _session: SessionUser,
        tx: Prisma.TransactionClient,
    ): Promise<LotDto['responseDel']> {
        const exists = await tx.lot.findFirst({ where: { id: dto.id } });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }

        const lot = await tx.lot.update({
            where: { id: dto.id },
            data: { status: Status.Delete },
            include: { reagent: { select: { id: true, name: true } } },
        });

        return {
            success: true,
            data: { ...lot, status: lot.status as PrismaStatus },
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
            data: lots.map((lot) => ({ id: lot.id, name: lot.name, status: lot.status as PrismaStatus })),
        };
    }
}
