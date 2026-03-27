import { Module } from '@nestjs/common';
import { StockModule } from '../../stock/stock.module';
import { SensorMonitorModule } from '../../sensorMonitor/sensorMonitor.module';
import { SchedulerService } from './scheduler.service';

@Module({
    imports: [StockModule, SensorMonitorModule],
    providers: [SchedulerService],
})
export class SchedulerModule { }
