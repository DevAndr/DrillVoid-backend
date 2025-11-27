import { Body, Controller, Get, Param } from '@nestjs/common';
import { GameDataService } from './game-data.service';

@Controller('game-data')
export class GameDataController {
  constructor(private readonly gameDataService: GameDataService) {}

  @Get('/:uid')
  handleGeneratePlanet(@Param('uid') uid: string) {
    console.log({ uid });
    return this.gameDataService.getGameData(uid);
  }
}
