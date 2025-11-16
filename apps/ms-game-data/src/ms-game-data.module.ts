import { Module } from '@nestjs/common';
import { MsGameDataController } from './ms-game-data.controller';
import { MsGameDataService } from './ms-game-data.service';

@Module({
  imports: [],
  controllers: [MsGameDataController],
  providers: [MsGameDataService],
})
export class MsGameDataModule {}
