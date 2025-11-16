import { Controller, Get } from '@nestjs/common';
import { MsPlanetService } from './ms-planet.service';

@Controller()
export class MsPlanetController {
  constructor(private readonly msPlanetService: MsPlanetService) {}

  @Get()
  getHello(): string {
    return this.msPlanetService.getHello();
  }
}
