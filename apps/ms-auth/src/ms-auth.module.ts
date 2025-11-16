import { Module } from '@nestjs/common';
import { MsAuthController } from './ms-auth.controller';
import { MsAuthService } from './ms-auth.service';
import { ConfigModule } from '@app/core';

@Module({
  imports: [ConfigModule],
  controllers: [MsAuthController],
  providers: [MsAuthService],
})
export class MsAuthModule {}
