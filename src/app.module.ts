import { Module } from '@nestjs/common';
import { HealthModule } from './features/health/health.module';
import { UserModule } from './features/user/core/user.module';

@Module({
  imports: [UserModule, HealthModule],
  providers: [],
  exports: [],
})
export class AppModule {}
