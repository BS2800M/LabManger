import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { StockModule } from '../../stock/stock.module';
import { InitService } from './init.service';
import { SensorMonitorModule } from '../../sensorMonitor/sensorMonitor.module';
import { TeamModule } from '../../identity/team.module';
import { UserModule } from '../../identity/user.module';
@Module({
    imports: [PrismaModule, StockModule, SensorMonitorModule, TeamModule, UserModule],
    providers: [InitService],
})
export class InitModule { }
