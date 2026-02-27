import { PrismaService } from '../prisma/prisma.service';
import { InventoryDto } from './inventory.dto';
import { SessionUser } from '../common/decorators/session-user.decorator';
export declare class InventoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private buildInventoryWhere;
    private mapInventory;
    private readonly inventoryInclude;
    show(dto: InventoryDto['requestShow'], session: SessionUser): Promise<InventoryDto['responseShow']>;
    showAll(dto: InventoryDto['requestShowAll'], session: SessionUser): Promise<InventoryDto['responseShowAll']>;
    auditAll(session: SessionUser): Promise<InventoryDto['responseAuditAll']>;
    statistics(dto: InventoryDto['requestStatistics'], session: SessionUser): Promise<InventoryDto['responseStatistics']>;
}
