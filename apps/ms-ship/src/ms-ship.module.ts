import { Module } from '@nestjs/common';
import { MsShipController } from './ms-ship.controller';
import { MsShipService } from './ms-ship.service';
import { ConfigModule } from '@app/core';

@Module({
  imports: [ConfigModule],
  controllers: [MsShipController],
  providers: [MsShipService],
})
export class MsShipModule {}
