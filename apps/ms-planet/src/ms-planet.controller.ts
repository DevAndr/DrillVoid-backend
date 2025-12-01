import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { MS_PLANET_PATTERNS } from '@app/contracts/planet/constants';
import { MsPlanetService } from './ms-planet.service';
import {
  PayloadJumpToPlanet,
  PayloadScanPlanets,
  PayloadTimePlanet,
  Point3D,
} from '@app/contracts/planet/types';

@Controller()
export class MsPlanetController {
  constructor(private readonly msPlanetService: MsPlanetService) {}

  // @EventPattern(MS_PLANET_PATTERNS.GENERATE_PLANET)
  // handleGeneratePlanet(@Payload() uid: string) {
  //   console.log({ uid });
  //   return { name: 'earth', biome: 'rocky', rarity: 'common', resources: {} };
  // }

  @MessagePattern(MS_PLANET_PATTERNS.GENERATE_PLANET)
  handleGeneratePlanetV2(@Payload() data: Point3D) {
    return this.msPlanetService.planetGenerate(data);
  }

  @MessagePattern(MS_PLANET_PATTERNS.SCAN)
  handleScanPlanets(@Payload() data: PayloadScanPlanets) {
    return this.msPlanetService.generateNearbyPlanets(data.point, data.options);
  }

  @MessagePattern(MS_PLANET_PATTERNS.JUMP_TO_PLANET)
  handleJumpPlanet(@Payload() data: PayloadJumpToPlanet) {
    return this.msPlanetService.jumpToPlanet(data.uid, data.target);
  }

  @MessagePattern(MS_PLANET_PATTERNS.GET_PLANET_BY_SEED)
  handleGetPlanetBySeed(@Payload() data: string) {
    return this.msPlanetService.getPlanetBySeed(data);
  }

  @MessagePattern(MS_PLANET_PATTERNS.GENERATE_PLANET_BY_SEED)
  handleGeneratePlanetBySeed(@Payload() data: string) {
    return this.msPlanetService.generatePlanetBySeed(data);
  }

  @MessagePattern(MS_PLANET_PATTERNS.TIME_MINING_PLANET)
  handleTimeMiningPlanet(@Payload() data: PayloadTimePlanet) {
    return this.msPlanetService.getTotalTimeMiningPlanet(data);
  }

  @MessagePattern(MS_PLANET_PATTERNS.TEST)
  handleTest(@Payload() data: string) {
    this.msPlanetService.test(data);

    return { data: 'test' };
  }
}
