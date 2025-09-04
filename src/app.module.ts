import { Module } from '@nestjs/common';
import { UserModule } from './features/user/core/user.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [UserModule, HealthModule],
  providers: [],
  exports: [],
})
export class AppModule {}
