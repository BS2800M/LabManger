import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { InventoryModule } from '../inventory/inventory.module';
import { LotController } from './lot.controller';
import { LotService } from './lot.service';

@Module({
    imports: [PrismaModule, InventoryModule],
    controllers: [LotController],
    providers: [LotService],
})
export class LotModule { }
