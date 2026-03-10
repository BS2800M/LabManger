import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { UserModule } from './user/user.module';
import { ReagentModule } from './reagent/reagent.module';
import { LotModule } from './lot/lot.module';
import { OperationModule } from './operation/operation.module';
import { InventoryModule } from './inventory/inventory.module';
import { InitModule } from './common/init/init.module';
import { SchemasModule } from './schemas/schemas.module';
import { SessionGuard } from './common/guards/session.guard';
import { LocationModule } from './location/location.module';
import { SensorRecordModule } from './sensorRecord/sensorRecord.module';
import { SchedulerModule } from './common/scheduler/scheduler.module';

@Module({
    imports: [ScheduleModule.forRoot(), PrismaModule, AuthModule, TeamModule, UserModule, ReagentModule, LotModule, OperationModule, InventoryModule, InitModule, SchemasModule, LocationModule, SensorRecordModule, SchedulerModule],
    controllers: [],
    providers: [
        { provide: APP_GUARD, useClass: SessionGuard },
    ],
})
export class AppModule { }
