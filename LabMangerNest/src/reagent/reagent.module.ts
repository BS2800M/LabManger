import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReagentController } from './reagent.controller';
import { ReagentService } from './reagent.service';

@Module({
    imports: [PrismaModule],
    controllers: [ReagentController],
    providers: [ReagentService],
})
export class ReagentModule { }
