import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InventoryService } from '../../stock/inventory.service';
import { SensorRecordService } from '../../sensorMonitor/sensorRecord.service';
import { MangerPrismaService } from '../../prisma/manger-prisma.service';

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(
        private readonly mangerPrisma: MangerPrismaService,
        private readonly inventoryService: InventoryService,
        private readonly sensorRecordService: SensorRecordService,
    ) { }

    @Cron('1 0 * * *')
    async dailyExpirationCheck(): Promise<void> {
        this.logger.log('开始每日有效期预警检查...');
        await this.mangerPrisma.$transaction(async (tx) => {
            await this.inventoryService.updateExpirationWarning(undefined, tx);
        });
        this.logger.log('每日有效期预警检查完成');
    }

    // 每10分钟检查一次传感器上传超时
    @Cron('*/10 * * * *')
    async checkUploadTimeout(): Promise<void> {
        this.logger.log('开始检查传感器上传超时...');
        const { overdueCount, normalCount } = await this.mangerPrisma.$transaction(async (tx) => {
            return this.sensorRecordService.checkUploadTimeout(tx);
        });
        this.logger.log(`传感器超时检查完成：超时 ${overdueCount} 个，正常 ${normalCount} 个`);
    }
}
