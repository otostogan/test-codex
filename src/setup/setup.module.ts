import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'otostogan-nest-logger';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), LoggerModule.forRoot()],
})
export class SetupModule {}


