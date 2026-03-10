import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OperationController } from './operation.controller';
import { OperationService } from './operation.service';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
    imports: [PrismaModule, InventoryModule],
    controllers: [OperationController],
    providers: [OperationService],
})
export class OperationModule { }
