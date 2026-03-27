import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MangerPrismaService } from '../prisma/manger-prisma.service';
import { InventoryService } from './inventory.service';
import { LotDto } from './lot.dto';
import { Status } from '../common/enums/enums';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { teamScope } from '../common/utils/scope.util';

@Injectable()
export class LotService {
    constructor(
        private readonly prisma: MangerPrismaService,
        private readonly inventoryService: InventoryService,
    ) { }

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

        await this.prisma.inventory.create({
            data: {
                reagentId: lot.reagentId,
                lotId: lot.id,
                teamId: lot.teamId,
                number: 0,
            },
        });

        return {
            success: true,
            data: lot,
        };
    }

    async show(dto: LotDto['requestShow'], session: SessionUser): Promise<LotDto['responseShow']> {
        const where: any = { status: { not: Status.Delete }, ...teamScope(session) };
        if (dto.name) { where.name = { contains: dto.name }; }

        const page = dto.page || 1;
        const pageSize = dto.pageSize || 10;

        const [lots, total] = await Promise.all([
            this.prisma.lot.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { id: 'desc' },
                include: { reagent: { select: { id: true, name: true } } },
            }),
            this.prisma.lot.count({ where }),
        ]);

        const totalPage = Math.ceil(total / pageSize);
        return {
            success: true,
            data: lots,
            meta: { total, page, pageSize, totalPage },
        };
    }

    async update(dto: LotDto['requestUpdate'], session: SessionUser): Promise<LotDto['responseUpdate']> {
        const exists = await this.prisma.lot.findFirst({ where: { id: dto.id, ...teamScope(session) } });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }
        const reagent = await this.prisma.reagent.findFirst({ where: { id: dto.reagentId } });
        if (!reagent) {
            throw new HttpException('不存在的试剂id', HttpStatus.FORBIDDEN);
        }

        const lot = await this.prisma.lot.update({
            where: { id: dto.id },
            data: {
                name: dto.name,
                reagentId: dto.reagentId,
                expirationDate: dto.expirationDate,
                status: dto.status,
            },
            include: { reagent: { select: { id: true, name: true } } },
        });

        await this.inventoryService.updateExpirationWarning(dto.id);

        return {
            success: true,
            data: lot,
        };
    }

    async del(dto: LotDto['requestDel'], session: SessionUser): Promise<LotDto['responseDel']> {
        const exists = await this.prisma.lot.findFirst({ where: { id: dto.id, ...teamScope(session) } });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }

        const lot = await this.prisma.lot.update({
            where: { id: dto.id },
            data: { status: Status.Delete },
            include: { reagent: { select: { id: true, name: true } } },
        });

        // 批号删除后同步删除对应库存记�?
        await this.prisma.inventory.deleteMany({ where: { lotId: dto.id } });

        return {
            success: true,
            data: lot,
        };
    }

    async showAll(dto: LotDto['requestShowAll'], session: SessionUser): Promise<LotDto['responseShowAll']> {
        const where: any = { status: Status.Enable, ...teamScope(session) };
        if (dto.reagentId) { where.reagentId = dto.reagentId; }

        const lots = await this.prisma.lot.findMany({
            where,
            select: { id: true, name: true },
            orderBy: { id: 'asc' },

        });

        return { success: true, data: lots };
    }
}


