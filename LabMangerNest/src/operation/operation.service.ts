import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OperationDto } from './operation.dto';
import { Status, OperationAction } from '../common/enums/enums';
import { SessionUser } from '../common/decorators/session-user.decorator';
import { teamScope } from '../common/utils/scope.util';

@Injectable()
export class OperationService {
    constructor(private readonly prisma: PrismaService) { }

    // 生成条码号：(id + 100000).toString()
    private generateBarcode(id: number): string {
        return (id + 100000).toString();
    }

    // 更新库存（增减），出库时检查库存是否充足
    private async updateInventory(
        reagentId: number,
        lotId: number,
        delta: number,
    ): Promise<{ isSuccess: boolean; message: string }> {
        const inv = await this.prisma.inventory.findFirst({
            where: { reagentId, lotId },
            include: { reagent: true },
        });
        if (!inv) return { isSuccess: false, message: '库存记录不存在' };

        if (delta < 0 && inv.number + delta < 0) {
            return { isSuccess: false, message: `${inv.reagent.name}库存不足` };
        }

        const newNumber = inv.number + delta;
        await this.prisma.inventory.updateMany({
            where: { reagentId, lotId },
            data: { number: newNumber },
        });

        if (newNumber <= inv.reagent.warnNumber) {
            return { isSuccess: true, message: `${inv.reagent.name}库存达到警告线` };
        }
        return { isSuccess: true, message: `${inv.reagent.name}库存更新成功` };
    }

    // 库存修正：按入库次数 - 出库次数重新计算
    private async auditInventory(reagentId: number, lotId: number): Promise<void> {
        const [inboundCount, outboundCount] = await Promise.all([
            this.prisma.operation.count({
                where: { reagentId, lotId, action: OperationAction.Inbound, status: { not: Status.Delete } },
            }),
            this.prisma.operation.count({
                where: { reagentId, lotId, action: OperationAction.Outbound, status: { not: Status.Delete } },
            }),
        ]);
        await this.prisma.inventory.updateMany({
            where: { reagentId, lotId },
            data: { number: inboundCount - outboundCount },
        });
    }

    async inbound(dto: OperationDto['requestInbound'], session: SessionUser): Promise<OperationDto['responseInbound']> {
        const maxIdResult = await this.prisma.operation.aggregate({ _max: { id: true } });
        let currentId = (maxIdResult._max.id ?? 0) + 1;

        // 构建所有入库操作记录
        const operationsData: any[] = [];
        for (const item of dto.inboundList) {
            for (let i = 0; i < item.number; i++) {
                operationsData.push({
                    reagentId: item.reagentId,
                    lotId: item.lotId,
                    userId: session.userId,
                    teamId: session.teamId,
                    barcodeNumber: this.generateBarcode(currentId),
                    note: item.note,
                    action: OperationAction.Inbound,
                    status: Status.Enable,
                });
                currentId++;
            }
        }

        // 批量创建操作记录
        await this.prisma.operation.createMany({ data: operationsData });

        // 并发更新库存，收集结果消息
        const inventoryResults = await Promise.all(
            dto.inboundList.map(item => this.updateInventory(item.reagentId, item.lotId, item.number)),
        );

        return {
            success: true,
            data: { messages: inventoryResults.map(r => r.message) },
        };
    }

    async outbound(dto: OperationDto['requestOutbound'], session: SessionUser): Promise<OperationDto['responseOutbound']> {
        const [inboundCount, outboundCount] = await Promise.all([
            this.prisma.operation.count({
                where: { barcodeNumber: dto.barcodeNumber, action: OperationAction.Inbound },
            }),
            this.prisma.operation.count({
                where: { barcodeNumber: dto.barcodeNumber, action: OperationAction.Outbound },
            }),
        ]);

        if (inboundCount === 0 && outboundCount === 0) {
            return { success: true, data: { status: 1, message: '该条码未进行入库' } };
        }
        if (inboundCount === 1 && outboundCount === 1) {
            return { success: true, data: { status: 1, message: '该条码已经出库' } };
        }
        if (inboundCount === 1 && outboundCount === 0) {
            const origin = await this.prisma.operation.findFirst({
                where: { barcodeNumber: dto.barcodeNumber, action: OperationAction.Inbound },
            });

            await this.prisma.operation.create({
                data: {
                    reagentId: origin.reagentId,
                    lotId: origin.lotId,
                    userId: session.userId,
                    teamId: origin.teamId,
                    barcodeNumber: origin.barcodeNumber,
                    note: origin.note,
                    action: OperationAction.Outbound,
                    status: Status.Enable,
                },
            });

            const result = await this.updateInventory(origin.reagentId, origin.lotId, -1);
            return { success: true, data: { status: 0, message: result.message } };
        }

        throw new HttpException('出库失败', HttpStatus.FORBIDDEN);
    }

    async specialOutbound(dto: OperationDto['requestSpecialOutbound'], session: SessionUser): Promise<OperationDto['responseSpecialOutbound']> {
        // 并发尝试更新所有库存
        const inventoryResults = await Promise.all(
            dto.outboundList.map(item => this.updateInventory(item.reagentId, item.lotId, -(item.number))),
        );

        // 只对库存充足的项创建出库记录
        const maxIdResult = await this.prisma.operation.aggregate({ _max: { id: true } });
        let currentId = (maxIdResult._max.id ?? 0) + 1;

        const validOperations: any[] = [];
        for (let i = 0; i < dto.outboundList.length; i++) {
            if (!inventoryResults[i].isSuccess) continue;
            const item = dto.outboundList[i];
            for (let j = 0; j < item.number; j++) {
                validOperations.push({
                    reagentId: item.reagentId,
                    lotId: item.lotId,
                    userId: session.userId,
                    teamId: session.teamId,
                    barcodeNumber: this.generateBarcode(currentId),
                    note: item.note,
                    action: OperationAction.Outbound,
                    status: Status.Enable,
                });
                currentId++;
            }
        }

        if (validOperations.length > 0) {
            await this.prisma.operation.createMany({ data: validOperations });
        }

        return {
            success: true,
            data: { messages: inventoryResults.map(r => r.message) },
        };
    }

    private buildOperationQuery(dto: { reagentName?: string; barcodeNumber?: string; startTime?: Date; endTime?: Date }, session: SessionUser) {
        const where: any = { status: { not: Status.Delete }, ...teamScope(session) };
        if (dto.reagentName) { where.reagent = { name: { contains: dto.reagentName } }; }
        if (dto.barcodeNumber) { where.barcodeNumber = { contains: dto.barcodeNumber }; }
        if (dto.startTime || dto.endTime) {
            where.createTime = {};
            if (dto.startTime) where.createTime.gte = dto.startTime;
            if (dto.endTime) where.createTime.lte = dto.endTime;
        }
        return where;
    }

    private mapOperation(op: any) {
        return {
            id: op.id,
            createTime: op.createTime,
            reagent: { id: op.reagent.id, name: op.reagent.name },
            lot: { id: op.lot.id, name: op.lot.name },
            user: { id: op.user.id, userName: op.user.userName },
            note: op.note,
            barcodeNumber: op.barcodeNumber,
            action: op.action,
        };
    }

    async show(dto: OperationDto['requestShow'], session: SessionUser): Promise<OperationDto['responseShow']> {
        const where = this.buildOperationQuery(dto, session);
        const page = dto.page || 1;
        const pageSize = dto.pageSize || 10;

        const [operations, total] = await Promise.all([
            this.prisma.operation.findMany({
                where, skip: (page - 1) * pageSize, take: pageSize,
                orderBy: { id: 'desc' },
                include: { reagent: { select: { id: true, name: true } }, lot: { select: { id: true, name: true } }, user: { select: { id: true, userName: true } } },
            }),
            this.prisma.operation.count({ where }),
        ]);

        const totalPage = Math.ceil(total / pageSize);
        return { success: true, data: operations.map(op => this.mapOperation(op)), meta: { total, page, pageSize, totalPage } };
    }

    async showAll(dto: OperationDto['requestShowAll'], session: SessionUser): Promise<OperationDto['responseShowAll']> {
        const where = this.buildOperationQuery(dto, session);
        const page = dto.page || 1;
        const pageSize = dto.pageSize || 9999999;

        const [operations, total] = await Promise.all([
            this.prisma.operation.findMany({
                where, skip: (page - 1) * pageSize, take: pageSize,
                orderBy: { id: 'desc' },
                include: { reagent: { select: { id: true, name: true } }, lot: { select: { id: true, name: true } }, user: { select: { id: true, userName: true } } },
            }),
            this.prisma.operation.count({ where }),
        ]);

        const totalPage = Math.ceil(total / pageSize);
        return { success: true, data: operations.map(op => this.mapOperation(op)), meta: { total, page, pageSize, totalPage } };
    }

    async update(dto: OperationDto['requestUpdate'], session: SessionUser): Promise<OperationDto['responseUpdate']> {
        const exists = await this.prisma.operation.findFirst({ where: { id: dto.id, ...teamScope(session) } });
        if (!exists) throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);

        const reagentExists = await this.prisma.reagent.findFirst({ where: { id: dto.reagentId } });
        if (!reagentExists) throw new HttpException('不存在的试剂id', HttpStatus.FORBIDDEN);

        const lotExists = await this.prisma.lot.findFirst({ where: { id: dto.lotId } });
        if (!lotExists) throw new HttpException('不存在的批号id', HttpStatus.FORBIDDEN);

        const before = { reagentId: exists.reagentId, lotId: exists.lotId };

        const updated = await this.prisma.operation.update({
            where: { id: dto.id },
            data: {
                reagentId: dto.reagentId,
                lotId: dto.lotId,
                createTime: dto.createTime,
                action: dto.action,
                note: dto.note,
                barcodeNumber: dto.barcodeNumber,
            },
        });

        // 修正受影响的两组库存（改前 + 改后）
        await this.auditInventory(before.reagentId, before.lotId);
        if (before.reagentId !== dto.reagentId || before.lotId !== dto.lotId) {
            await this.auditInventory(dto.reagentId, dto.lotId);
        }

        return { success: true, data: updated };
    }

    async del(dto: OperationDto['requestDel'], session: SessionUser): Promise<OperationDto['responseDel']> {
        const exists = await this.prisma.operation.findFirst({ where: { id: dto.id, ...teamScope(session) } });
        if (!exists) throw new HttpException('不存在的资源id', HttpStatus.FORBIDDEN);

        const deleted = await this.prisma.operation.update({
            where: { id: dto.id },
            data: { status: Status.Delete },
        });

        // 软删除后修正库存
        await this.auditInventory(deleted.reagentId, deleted.lotId);

        return { success: true, data: deleted };
    }
}
