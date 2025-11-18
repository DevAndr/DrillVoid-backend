import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlanetService } from './planet.service';

@Controller('planet')
export class PlanetController {
  constructor(private readonly planetService: PlanetService) {}

  @Get()
  test() {
    return { data: 1234 };
  }

  @Post('generate_planet/:uid')
  handleGeneratePlanet(@Param('uid') uid: string, @Body() data) {
    console.log({ uid });
    return this.planetService.generatePlanet(data);
  }
}
