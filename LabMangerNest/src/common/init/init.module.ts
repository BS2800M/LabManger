import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { InventoryModule } from '../../inventory/inventory.module';
import { InitService } from './init.service';

@Module({
    imports: [PrismaModule, InventoryModule],
    providers: [InitService],
})
export class InitModule { }
