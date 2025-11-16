import { Module } from '@nestjs/common';
import { MsUserController } from './ms-user.controller';
import { MsUserService } from './ms-user.service';
import { ConfigModule } from '@app/core';

@Module({
  imports: [ConfigModule],
  controllers: [MsUserController],
  providers: [MsUserService],
})
export class MsUserModule {}
