import { Controller, Get } from '@nestjs/common';
import { MsGameDataService } from './ms-game-data.service';

@Controller()
export class MsGameDataController {
  constructor(private readonly msGameDataService: MsGameDataService) {}

  @Get()
  getHello(): string {
    return this.msGameDataService.getHello();
  }
}
