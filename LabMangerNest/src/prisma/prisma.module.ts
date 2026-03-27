import { Module, Global } from '@nestjs/common';
import { MangerPrismaService } from './manger-prisma.service';
import { UserPrismaService } from './user-prisma.service';
import { PatientTestPrismaService } from './patientTest-prisma.service';

@Global()
@Module({
    providers: [MangerPrismaService, UserPrismaService, PatientTestPrismaService],
    exports: [MangerPrismaService, UserPrismaService, PatientTestPrismaService],
})
export class PrismaModule { }
