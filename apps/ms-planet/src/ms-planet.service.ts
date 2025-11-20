import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { createNoise3D } from 'simplex-noise';
import {
  PlanetType,
  Rarity,
} from '../../../libs/prisma/generated/prisma/enums';
import { RESOURCE_INFO, RESOURCE_PLANET_POOL } from './constants';
import { SciFiNameGenerator } from './utils/SciFiNameGenerator';
import {
  Point3D,
  ResourcePlanet,
  ScanOptions,
} from '@app/contracts/planet/types';
import { xor4096 } from 'seedrandom';
import { isDefined } from '@app/core/utils';
import { PlanetResource } from '../../../libs/prisma/generated/prisma/client';
import {
  PlanetResourceCreateInput,
  PlanetResourceCreateManyInput,
} from '../../../libs/prisma/generated/prisma/models/PlanetResource';

@Injectable()
export class MsPlanetService {
  private readonly logger = new Logger(MsPlanetService.name);
  private simplex = createNoise3D();
  constructor(private readonly prisma: PrismaService) {}

  private mulberry32(a: number) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  makeSeedByPoint(point: Point3D) {
    return `${point.x}_${point.y}_${point.z}`;
  }

  planetGenerate(point: Point3D) {
    const seed = this.makeSeedByPoint(point);
    // const rng = this.mulberry32(+seed);
    const rng = xor4096(seed);

    // 1. Biome
    const biome = this.defineBiome(point);

    this.logger.log({ biome });

    // 2. Rarity
    const rarity = this.defineRarity(point);

    this.logger.log({ rarity });

    // 3. Resources
    // Количество ресурсов
    const resourceCount = Math.floor(rng() * 3) + 2; // 2–4 ресурса
    const resources: ResourcePlanet[] = [];

    for (let i = 0; i < resourceCount; i++) {
      const resource = this.generateResource(biome, rarity, rng);
      resources.push(resource);
    }

    return {
      name: this.generateName(rng),
      biome,
      rarity,
      resources,
      seed,
      position: point,
    };
  }

  private defineBiome(point: Point3D) {
    const noise = this.simplex(point.x, point.y, point.z);
    const n = (noise + 1) / 2;

    if (n < 0.15) return PlanetType.ROCKY;
    if (n < 0.3) return PlanetType.LUSH;
    if (n < 0.5) return PlanetType.FROZEN;
    if (n < 0.7) return PlanetType.TOXIC;
    if (n < 0.85) return PlanetType.EXOTIC;
    return PlanetType.BLACKHOLE;
  }

  private defineRarity(point: Point3D) {
    const noise = this.simplex(point.x * 2, point.y * 2, point.z * 2);
    const n = (noise + 1) / 2;

    if (n < 0.6) return Rarity.COMMON;
    if (n < 0.85) return Rarity.UNCOMMON;
    if (n < 0.94) return Rarity.RARE;
    if (n < 0.99) return Rarity.EPIC;
    return Rarity.LEGENDARY;
  }

  private defineRarityResource(rng: () => number) {
    const rndValue = rng();
    const n = (rndValue + 1) / 2;

    if (n < 0.6) return Rarity.COMMON;
    if (n < 0.85) return Rarity.UNCOMMON;
    if (n < 0.94) return Rarity.RARE;
    if (n < 0.99) return Rarity.EPIC;
    return Rarity.LEGENDARY;
  }

  private generateName(rng: () => number) {
    return SciFiNameGenerator.generate(rng);
  }

  private generateResource(
    biome: PlanetType,
    rarity: Rarity,
    rng: () => number,
  ): ResourcePlanet {
    const resources = RESOURCE_PLANET_POOL[biome][rarity];
    const resource = resources[Math.floor(rng() * resources.length)];
    const rarityResource = this.defineRarityResource(rng);

    const [min, max] = RESOURCE_INFO[resource][rarityResource];
    const amount = Math.floor(rng() * (max - min) + min * 0.2); // +20% per sector

    return {
      type: resource,
      rarity: rarityResource,
      totalAmount: amount,
      remainingAmount: amount,
    };
  }

  generateNearbyPlanets(currentPos: Point3D, options: ScanOptions) {
    const { count, radius } = options;

    const baseSeed = `${currentPos.x}${currentPos.y}${currentPos.z}`;
    const rng = this.mulberry32(+baseSeed);

    const planets: any[] = [];

    for (let i = 0; i < count; i++) {
      const dx = Math.floor((rng() - 0.5) * radius);
      const dy = Math.floor((rng() - 0.5) * radius);
      const dz = Math.floor((rng() - 0.5) * radius);

      const x = currentPos.x + dx;
      const y = currentPos.y + dy;
      const z = currentPos.z + dz;

      // // Seed планеты = координаты
      // const planetSeed = `${x}_${y}_${z}`;

      planets.push(this.planetGenerate({ x, y, z }));
    }

    return planets;
  }

  async jumpToPlanet(uid: string, target: Point3D) {
    const gameData = await this.prisma.gameData.findUnique({
      where: {
        uid,
      },
    });

    if (!gameData) {
      throw new BadRequestException('Game data not found');
    }

    const currentShip = await this.prisma.ship.findUnique({
      where: { id: gameData.shipId },
    });

    //TODO: на будущее
    // const fuelRequired = distance * ship.fuelPerUnit;
    //
    // if (ship.fuel < fuelRequired) {
    //   throw new Error("Недостаточно топлива");
    // }
    //
    // // списываем топливо
    // await this.shipService.updateFuel(userId, ship.fuel - fuelRequired);

    const seed = this.makeSeedByPoint(target);
    let planet = await this.prisma.planet.findUnique({ where: { seed } });

    if (!isDefined(planet)) {
      const generatedPlanet = this.planetGenerate(target);

      await this.prisma.$transaction(async (tx) => {
        planet = await tx.planet.create({
          data: {
            name: generatedPlanet.name,
            seed: generatedPlanet.seed,
            rarity: generatedPlanet.rarity,
            type: generatedPlanet.biome,
            x: generatedPlanet.position.x,
            y: generatedPlanet.position.y,
            z: generatedPlanet.position.z,
            ownerBy: uid,
          },
        });

        const createResources: PlanetResourceCreateManyInput[] = [];

        for (const resource of generatedPlanet.resources) {
          createResources.push({
            planetId: planet.id,
            type: resource.type,
            totalAmount: resource.totalAmount,
            current: resource.remainingAmount,
            drillPowerRequired: 1, //TODO: сделать потом случайным в зависимости от rarity
          });

          // this.prisma.planetResource.create({
          //   data: {
          //     planetId: planet.id,
          //     type: resource.type,
          //     totalAmount: resource.totalAmount,
          //     current: resource.remainingAmount,
          //     drillPowerRequired: 1, //TODO: сделать потом случайным в зависимости от rarity
          //   },
          // });
        }

        await tx.planetResource.createMany({ data: createResources });
      });
    }

    gameData.x = target.x;
    gameData.y = target.y;
    gameData.z = target.z;

    await this.prisma.gameData.update({
      where: {
        uid,
      },
      data: { ...gameData, currentPlanetId: planet.id },
    });

    await this.prisma.planetVisit.create({
      data: { planetId: planet.id, uid, exhausted: false, mined: {} },
    });

    return this.prisma.planet.findUnique({
      where: { id: planet.id },
      include: { planetResource: true },
    });
  }
}

class RNG {
  constructor(private seed: number) {}
  nextFloat(): number {
    this.seed = (this.seed * 16807 + 0xdeadbeef) % 2147483647; // Knuth multiplier
    return this.seed / 2147483647;
  }
  nextInt(max: number): number {
    return Math.floor(this.nextFloat() * max);
  }
  nextRange(min: number, max: number): number {
    return min + this.nextInt(max - min + 1);
  }
}
