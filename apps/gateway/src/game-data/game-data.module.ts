import { Module } from '@nestjs/common';
import { GameDataService } from './game-data.service';
import { GameDataController } from './game-data.controller';

@Module({
  providers: [GameDataService],
  controllers: [GameDataController]
})
export class GameDataModule {}
