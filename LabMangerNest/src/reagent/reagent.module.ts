import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReagentController } from './reagent.controller';
import { ReagentService } from './reagent.service';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
    imports: [PrismaModule, InventoryModule],
    controllers: [ReagentController],
    providers: [ReagentService],
})
export class ReagentModule { }
