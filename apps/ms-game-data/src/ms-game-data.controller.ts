import { Controller } from '@nestjs/common';
import { MsGameDataService } from './ms-game-data.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { MS_GAME_DATA_PATTERNS } from '@app/contracts';

@Controller()
export class MsGameDataController {
  constructor(private readonly msGameDataService: MsGameDataService) {}

  @MessagePattern(MS_GAME_DATA_PATTERNS.INITIAL)
  handleScanPlanets(@Payload() uid: string, @Ctx() context: RmqContext) {
    console.log(`Pattern: ${context.getPattern()}`, uid);
    return this.msGameDataService.initial(uid);
  }

  @MessagePattern(MS_GAME_DATA_PATTERNS.GET_GAME_DATA)
  handleGetDataGame(@Payload() uid: string, @Ctx() context: RmqContext) {
    console.log(`Pattern: ${context.getPattern()}`, uid);
    return this.msGameDataService.getGameData(uid);
  }
}
