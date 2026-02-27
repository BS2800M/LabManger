import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
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

@Module({
    imports: [PrismaModule, AuthModule, TeamModule, UserModule, ReagentModule, LotModule, OperationModule, InventoryModule, InitModule, SchemasModule],
    controllers: [],
    providers: [
        { provide: APP_GUARD, useClass: SessionGuard },
    ],
})
export class AppModule { }
