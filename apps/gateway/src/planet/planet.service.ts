import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  MS_PLANET_NAME,
  MS_PLANET_PATTERNS,
} from '@app/contracts/planet/constants';
import { firstValueFrom } from 'rxjs';
import { PayloadJumpToPlanet } from '@app/contracts';

@Injectable()
export class PlanetService {
  constructor(
    @Inject(MS_PLANET_NAME) private readonly planetClient: ClientProxy,
  ) {}

  generatePlanet(uid: string) {
    return firstValueFrom(
      this.planetClient.send(MS_PLANET_PATTERNS.GENERATE_PLANET, uid),
    );
  }

  scanPlanets(data) {
    return firstValueFrom(
      this.planetClient.send(MS_PLANET_PATTERNS.SCAN, data),
    );
  }

  jumpToPlanet(data: PayloadJumpToPlanet) {
    return firstValueFrom(
      this.planetClient.send(MS_PLANET_PATTERNS.JUMP_TO_PLANET, data),
    );
  }

  getPlanetBySeed(seed: string) {
    return firstValueFrom(
      this.planetClient.send(MS_PLANET_PATTERNS.GET_PLANET_BY_SEED, seed),
    );
  }

  generatePlanetBySeed(seed: string) {
    return firstValueFrom(
      this.planetClient.send(MS_PLANET_PATTERNS.GENERATE_PLANET_BY_SEED, seed),
    );
  }

  timeMiningPlanet(data: PayloadJumpToPlanet) {
    return firstValueFrom(
      this.planetClient.send(MS_PLANET_PATTERNS.TIME_MINING_PLANET, data),
    );
  }
}
