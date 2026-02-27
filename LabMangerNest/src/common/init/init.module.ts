import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { InitService } from './init.service';

@Module({
    imports: [PrismaModule],
    providers: [InitService],
})
export class InitModule { }
