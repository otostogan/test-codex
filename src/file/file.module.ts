import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '../db/db.module';
import { FileService } from './file.service';
import { FileController } from './file.controller';

@Module({
  imports: [DbModule, ConfigModule],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
