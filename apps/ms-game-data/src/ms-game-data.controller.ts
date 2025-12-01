import { Controller } from '@nestjs/common';
import { MsGameDataService } from './ms-game-data.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MS_GAME_DATA_PATTERNS } from '@app/contracts';

@Controller()
export class MsGameDataController {
  constructor(private readonly msGameDataService: MsGameDataService) {}

  @MessagePattern(MS_GAME_DATA_PATTERNS.INITIAL)
  handleScanPlanets(@Payload() uid: string) {
    return this.msGameDataService.initial(uid);
  }

  @MessagePattern(MS_GAME_DATA_PATTERNS.GET_GAME_DATA)
  handleGetDataGame(@Payload() uid: string) {
    return this.msGameDataService.getGameData(uid);
  }

  @MessagePattern(MS_GAME_DATA_PATTERNS.GET_RESOURCES)
  handleGetResources(@Payload() uid: string) {
    return this.msGameDataService.getResources(uid);
  }
}
