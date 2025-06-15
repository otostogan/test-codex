import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SetupModule } from './setup/setup.module';

@Module({
  imports: [SetupModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
