import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { MS_PLANET_PATTERNS } from '@app/contracts/planet/constants';

@Controller()
export class MsPlanetController {
  // constructor(private readonly msPlanetService: MsPlanetService) {}

  @EventPattern(MS_PLANET_PATTERNS.GENERATE_PLANET)
  handleGeneratePlanet(@Payload() uid: string) {
    console.log({ uid });
    return { name: 'earth', biome: 'rocky', rarity: 'common', resources: {} };
  }

  @MessagePattern(MS_PLANET_PATTERNS.GENERATE_PLANET)
  handleScanPlanets(@Payload() data: number[], @Ctx() context: RmqContext) {
    console.log(`Pattern: ${context.getPattern()}`);
    return 123;
  }

  // @MessagePattern(MS_PLANET_PATTERNS.GENERATE_PLANET)
  // test() {
  //   console.log('data');
  // }
}
