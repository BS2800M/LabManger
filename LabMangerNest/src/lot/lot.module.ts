import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LotController } from './lot.controller';
import { LotService } from './lot.service';

@Module({
    imports: [PrismaModule],
    controllers: [LotController],
    providers: [LotService],
})
export class LotModule { }
