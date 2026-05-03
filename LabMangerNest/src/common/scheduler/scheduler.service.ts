import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SensorRecordService } from '../../sensorMonitor/sensorRecord.service';
import { MangerPrismaService } from '../../prisma/manger-prisma.service';

@Injectable()
export class SchedulerService {

    constructor(
        private readonly mangerPrisma: MangerPrismaService,
        private readonly sensorRecordService: SensorRecordService,
    ) { }

    // 每10分钟检查一次传感器上传超时
    @Cron('*/10 * * * *')
    async checkUploadTimeout(): Promise<void> {
        const { overdueCount, normalCount } = await this.mangerPrisma.$transaction(async (tx) => {
            return this.sensorRecordService.checkUploadTimeout(tx);
        });
    }
}
