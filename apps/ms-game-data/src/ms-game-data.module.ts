import { Module } from '@nestjs/common';
import { MsGameDataController } from './ms-game-data.controller';
import { MsGameDataService } from './ms-game-data.service';
import { ConfigModule } from '@app/core';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [MsGameDataController],
  providers: [MsGameDataService],
})
export class MsGameDataModule {}
