import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReagentController } from './reagent.controller';
import { ReagentService } from './reagent.service';
import { LotController } from './lot.controller';
import { LotService } from './lot.service';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { OperationController } from './operation.controller';
import { OperationService } from './operation.service';

@Module({
    imports: [PrismaModule],
    controllers: [
        ReagentController,
        LotController,
        InventoryController,
        OperationController,
    ],
    providers: [
        ReagentService,
        LotService,
        InventoryService,
        OperationService,
    ],
    exports: [InventoryService],
})
export class StockModule { }
