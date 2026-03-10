import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SensorRecordController } from './sensorRecord.controller';
import { SensorRecordService } from './sensorRecord.service';

@Module({
    imports: [PrismaModule],
    controllers: [SensorRecordController],
    providers: [SensorRecordService],
    exports: [SensorRecordService],
})
export class SensorRecordModule { }
