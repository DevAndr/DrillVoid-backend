import { Module } from '@nestjs/common';
import { MsShipController } from './ms-ship.controller';
import { MsShipService } from './ms-ship.service';

@Module({
  imports: [],
  controllers: [MsShipController],
  providers: [MsShipService],
})
export class MsShipModule {}
