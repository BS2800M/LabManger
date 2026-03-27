import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { SensorRecordController } from './sensorRecord.controller';
import { SensorRecordService } from './sensorRecord.service';

@Module({
    imports: [PrismaModule],
    controllers: [LocationController, SensorRecordController],
    providers: [LocationService, SensorRecordService],
    exports: [SensorRecordService],
})
export class SensorMonitorModule { }
