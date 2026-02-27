import { Controller, Get, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryDto, InventoryZod } from './inventory.dto';
import { ZodQuery, ZodBody } from '../common/decorators/zod.decorator';
import { SessionUser, SessionUser as ISessionUser } from '../common/decorators/session-user.decorator';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Get('show')
    show(
        @ZodQuery(InventoryZod.requestShow) dto: InventoryDto['requestShow'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.inventoryService.show(dto, session);
    }

    @Get('showAll')
    showAll(
        @ZodQuery(InventoryZod.requestShowAll) dto: InventoryDto['requestShowAll'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.inventoryService.showAll(dto, session);
    }

    @Post('auditAll')
    auditAll(
        @ZodBody(InventoryZod.requestAuditAll) _dto: any,
        @SessionUser() session: any,
    ) {
        return this.inventoryService.auditAll(session);
    }

    @Get('statistics')
    statistics(
        @ZodQuery(InventoryZod.requestStatistics) dto: any,
        @SessionUser() session: any,
    ) {
        return this.inventoryService.statistics(dto, session);
    }
}
