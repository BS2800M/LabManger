import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { MangerPrismaService } from '../prisma/manger-prisma.service';
import { ReagentDto } from './reagent.dto';
import { Status } from '../common/enums/enums';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { InventoryService } from './inventory.service';
import { LotService } from './lot.service';

@Injectable()
export class ReagentService {
    constructor(
        private readonly prisma: MangerPrismaService,
        private readonly inventoryService: InventoryService,
        private readonly lotService: LotService,
    ) { }

    private normalizeDi(di?: string): string {
        return (di ?? '').trim();
    }

    private async isDiExists(di: string, excludeId?: number): Promise<boolean> {
        const existing = await this.prisma.reagent.findFirst({
            where: {
                di,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
            select: { id: true },
        });
        return Boolean(existing);
    }

    private async resolveDiOrThrow(diInput: string | undefined, excludeId?: number): Promise<string> {
        const normalizedDi = this.normalizeDi(diInput);

        if (!normalizedDi) {
            // DI 为空时自动生成唯一 UUID。
            let generatedDi = randomUUID();
            while (await this.isDiExists(generatedDi, excludeId)) {
                generatedDi = randomUUID();
            }
            return generatedDi;
        }

        const exists = await this.isDiExists(normalizedDi, excludeId);
        if (exists) {
            throw new HttpException('此DI（标识符）已存在于其他试剂中', HttpStatus.BAD_REQUEST);
        }

        return normalizedDi;
    }

    async add(dto: ReagentDto['requestAdd'], session: SessionUser): Promise<ReagentDto['responseAdd']> {
        const di = await this.resolveDiOrThrow(dto.di);

        const reagent = await this.prisma.reagent.create({
            data: {
                name: dto.name,
                di,
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
            expirationDate.setFullYear(expirationDate.getFullYear() + 1);

            await this.lotService.add(
                {
                    name: '默认' + reagent.name,
                    reagentId: reagent.id,
                    expirationDate,
                },
                session,
            );
        }

        return { success: true, data: reagent };
    }

    async show(dto: ReagentDto['requestShow'], session: SessionUser): Promise<ReagentDto['responseShow']> {
        const where: any = { status: { not: Status.Delete } };
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
        const exists = await this.prisma.reagent.findFirst({ where: { id: dto.id } });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }

        const di = await this.resolveDiOrThrow(dto.di, dto.id);

        const reagent = await this.prisma.reagent.update({
            where: { id: dto.id },
            data: {
                name: dto.name,
                di,
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
        const exists = await this.prisma.reagent.findFirst({ where: { id: dto.id } });
        if (!exists) {
            throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);
        }

        const reagent = await this.prisma.reagent.update({
            where: { id: dto.id },
            data: { status: Status.Delete },
        });
        return { success: true, data: reagent };
    }

    async showAll(session: SessionUser): Promise<ReagentDto['responseShowAll']> {
        const reagents = await this.prisma.reagent.findMany({
            where: { status: Status.Enable },
            select: { id: true, name: true },
            orderBy: { id: 'asc' },
        });

        return { success: true, data: reagents };
    }
}
