import { Module } from '@nestjs/common';
import { MsShipController } from './ms-ship.controller';
import { MsShipService } from './ms-ship.service';
import { ConfigModule } from '@app/core';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [MsShipController],
  providers: [MsShipService],
})
export class MsShipModule {}
