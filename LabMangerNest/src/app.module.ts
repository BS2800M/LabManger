import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './identity/auth.module';
import { TeamModule } from './identity/team.module';
import { UserModule } from './identity/user.module';
import { StockModule } from './stock/stock.module';
import { InitModule } from './common/init/init.module';
import { SchemasModule } from './schemas/schemas.module';
import { SessionGuard } from './common/guards/session.guard';
import { SensorMonitorModule } from './sensorMonitor/sensorMonitor.module';
import { SchedulerModule } from './common/scheduler/scheduler.module';

@Module({
    imports: [ScheduleModule.forRoot(), PrismaModule, AuthModule, TeamModule, UserModule, StockModule, InitModule, SchemasModule, SensorMonitorModule, SchedulerModule],
    controllers: [],
    providers: [
        { provide: APP_GUARD, useClass: SessionGuard },
    ],
})
export class AppModule { }
