import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  MS_PLANET_NAME,
  MS_PLANET_PATTERNS,
} from '@app/contracts/planet/constants';
import { firstValueFrom } from 'rxjs';

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
}
