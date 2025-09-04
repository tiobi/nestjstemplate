import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './features/user/core/user.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [UserModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
