import { Module } from '@nestjs/common';
import { InventoryModule } from '../../inventory/inventory.module';
import { SensorRecordModule } from '../../sensorRecord/sensorRecord.module';
import { SchedulerService } from './scheduler.service';

@Module({
    imports: [InventoryModule, SensorRecordModule],
    providers: [SchedulerService],
})
export class SchedulerModule { }
