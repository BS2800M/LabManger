import { Controller, Get } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryDto, InventoryZod } from './inventory.dto';
import { ZodQuery } from '../common/decorators/zod.decorator';
import { SessionUser, SessionUser as ISessionUser } from '../common/decorators/session-user.decorator';

@Controller('stock/inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Get('showReagent')
    showReagent(
        @ZodQuery(InventoryZod.requestShowReagent) dto: InventoryDto['requestShowReagent'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.inventoryService.showReagent(dto, session);
    }

    @Get('showLot')
    showLot(
        @ZodQuery(InventoryZod.requestShowLot) dto: InventoryDto['requestShowLot'],
        @SessionUser() session: ISessionUser,
    ) {
        return this.inventoryService.showLot(dto, session);
    }
}
