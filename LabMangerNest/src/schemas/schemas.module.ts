import { Module } from '@nestjs/common';
import { SchemasController } from './schemas.controller';

@Module({
  controllers: [SchemasController],
  providers: [],
})
export class SchemasModule {}
