import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReagentDto } from './reagent.dto';
import { Status } from '../common/enums/enums';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { teamScope } from '../common/utils/scope.util';
import { InventoryService } from '../inventory/inventory.service';
@Injectable()
export class ReagentService {
    constructor(private readonly prisma: PrismaService, private readonly inventoryService: InventoryService) { }


    async add(dto: ReagentDto['requestAdd'], session: SessionUser): Promise<ReagentDto['responseAdd']> {
        const reagent = await this.prisma.reagent.create({
            data: {
                name: dto.name,
                specifications: dto.specifications,
                price: dto.price,
                storageCondition: dto.storageCondition,
                manufacturer: dto.manufacturer,
                note: dto.note,
                warnNumber: dto.warnNumber,
                warnDays: dto.warnDays,
                teamId: session.teamId,
            },
        });

        if (dto.generateLot) {
            const expirationDate = new Date();
            expirationDate.setMonth(expirationDate.getMonth() + 10);

            const lot = await this.prisma.lot.create({
                data: {
                    name: '默认' + reagent.name,
                    reagentId: reagent.id,
                    expirationDate,
                    teamId: reagent.teamId,
                },
            });

            await this.prisma.inventory.create({
                data: {
                    reagentId: reagent.id,
                    lotId: lot.id,
                    teamId: reagent.teamId,
                    number: 0,
                },
            });
        }

        return { success: true, data: reagent };
    }

    async show(dto: ReagentDto['requestShow'], session: SessionUser): Promise<ReagentDto['responseShow']> {
        const where: any = { status: { not: Status.Delete }, ...teamScope(session) };
        if (dto.name) { where.name = { contains: dto.name }; }

        const page = dto.page || 1;
        const pageSize = dto.pageSize || 10;

        const [reagents, total] = await Promise.all([
            this.prisma.reagent.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { id: 'desc' },
            }),
            this.prisma.reagent.count({ where }),
        ]);

        const totalPage = Math.ceil(total / pageSize);
        return { success: true, data: reagents, meta: { total, page, pageSize, totalPage } };
    }

    async update(dto: ReagentDto['requestUpdate'], session: SessionUser): Promise<ReagentDto['responseUpdate']> {
        const exists = await this.prisma.reagent.findFirst({ where: { id: dto.id, ...teamScope(session) } });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }

        const reagent = await this.prisma.reagent.update({
            where: { id: dto.id },
            data: {
                name: dto.name,
                specifications: dto.specifications,
                price: dto.price,
                storageCondition: dto.storageCondition,
                manufacturer: dto.manufacturer,
                note: dto.note,
                warnNumber: dto.warnNumber,
                warnDays: dto.warnDays,
                status: dto.status,
                teamId: session.teamId,
            },
        });
        await this.inventoryService.updateInventory(reagent.id, 0);

        return { success: true, data: reagent };
    }

    async del(dto: ReagentDto['requestDel'], session: SessionUser): Promise<ReagentDto['responseDel']> {
        const exists = await this.prisma.reagent.findFirst({ where: { id: dto.id, ...teamScope(session) } });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }

        const reagent = await this.prisma.reagent.update({
            where: { id: dto.id },
            data: { status: Status.Delete },
        });
        await this.prisma.lot.updateMany({ where: { reagentId: dto.id }, data: { status: Status.Delete } });
        await this.prisma.inventory.deleteMany({ where: { reagentId: dto.id } });
        return { success: true, data: reagent };
    }

    async showAll(session: SessionUser): Promise<ReagentDto['responseShowAll']> {
        const reagents = await this.prisma.reagent.findMany({
            where: { status: Status.Enable, ...teamScope(session) },
            select: { id: true, name: true },
            orderBy: { id: 'asc' },
        });

        return { success: true, data: reagents };
    }
}
