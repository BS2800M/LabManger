import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../../generated/prisma-patient-test/client';

const patientTestAdapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_PATIENT_TEST_URL || 'file:./prisma/PatientTest.db',
});

@Injectable()
export class PatientTestPrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({ adapter: patientTestAdapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
