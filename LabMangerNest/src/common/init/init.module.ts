import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { StockModule } from '../../stock/stock.module';
import { InitService } from './init.service';
import { SensorMonitorModule } from '../../sensorMonitor/sensorMonitor.module';
@Module({
    imports: [PrismaModule, StockModule, SensorMonitorModule],
    providers: [InitService],
})
export class InitModule { }
