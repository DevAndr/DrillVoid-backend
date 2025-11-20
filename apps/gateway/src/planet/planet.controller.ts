import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlanetService } from './planet.service';
import {
  PayloadJumpToPlanet,
  PayloadScanPlanets,
} from '@app/contracts/planet/types';

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

  @Post('scan_planets/:uid')
  handleScanPlanets(
    @Param('uid') uid: string,
    @Body() data: PayloadScanPlanets,
  ) {
    console.log({ uid });
    return this.planetService.scanPlanets(data);
  }

  @Post('jump_to_planet')
  handleJumpToPlanet(@Body() data: PayloadJumpToPlanet) {
    return this.planetService.jumpToPlanet(data);
  }
}
