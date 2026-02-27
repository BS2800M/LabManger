import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OperationController } from './operation.controller';
import { OperationService } from './operation.service';

@Module({
    imports: [PrismaModule],
    controllers: [OperationController],
    providers: [OperationService],
})
export class OperationModule { }
