import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { createNoise3D } from 'simplex-noise';
import {
  PlanetType,
  Rarity,
} from '../../../libs/prisma/generated/prisma/enums';
import { RESOURCE_INFO, RESOURCE_PLANET_POOL } from './constants';
import { SciFiNameGenerator } from './utils/SciFiNameGenerator';
import {
  PayloadTimePlanet,
  Point3D,
  ResourcePlanet,
  ScanOptions,
} from '@app/contracts/planet/types';
import { isDefined } from '@app/core/utils';
import { PlanetResourceCreateManyInput } from '../../../libs/prisma/generated/prisma/models/PlanetResource';
import { distanceBetweenCoord } from '../../gateway/src/planet/utils';
import { RpcException } from '@nestjs/microservices';
import { RARITY_MINING_MULTIPLIER } from '@app/contracts';
import { createXor4096 } from './utils';
import seedrandom from 'seedrandom';
import { xor4096 } from 'seedrandom';

@Injectable()
export class MsPlanetService {
  private readonly logger = new Logger(MsPlanetService.name);
  private simplex = createNoise3D();
  constructor(private readonly prisma: PrismaService) {
    this.simplex = createNoise3D();
  }

  makeSeedByPoint(point: Point3D) {
    return `${point.x}_${point.y}_${point.z}`;
  }

  planetGenerate(point: Point3D) {
    const seed = this.makeSeedByPoint(point);
    const rng = xor4096(seed);

    // 1. Biome
    const biome = this.defineBiome(rng);

    this.logger.log({ biome });

    // 2. Rarity
    const rarity = this.defineRarity(rng);

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

  generateNearbyPlanets(currentPos: Point3D, options: ScanOptions) {
    const { count, radius } = options;

    const offsets = this.getDeterministicOffsets(count, radius, currentPos);

    const planets: any[] = [];

    for (const { x, y, z } of offsets) {
      if (x === currentPos.x && y === currentPos.y && z === currentPos.z)
        continue;

      const point = {
        x: currentPos.x + x,
        y: currentPos.y + y,
        z: currentPos.z + z,
      };
      planets.push(this.planetGenerate(point)); // ← только от координат!
    }

    return planets;
  }

  private getDeterministicOffsets(
    count: number,
    radius: number,
    center: Point3D,
  ): Point3D[] {
    const offsets: Point3D[] = [];
    const seed = this.makeSeedByPoint(center) + `_scan_${radius}_${count}`;
    const rng = createXor4096(seed);
    const seen = new Set<string>();

    for (let i = 0; i < count * 3; i++) {
      // *3 чтобы точно набрать count уникальных
      const dx = Math.floor((rng() - 0.5) * radius * 2);
      const dy = Math.floor((rng() - 0.5) * radius * 2);
      const dz = Math.floor((rng() - 0.5) * radius * 2);

      if (dx === 0 && dy === 0 && dz === 0) continue;

      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist > radius) continue;

      // Проверка на дубли
      const key = `${dx}_${dy}_${dz}`;
      if (seen.has(key)) continue;

      seen.add(key);
      offsets.push({ x: dx, y: dy, z: dz });

      if (offsets.length >= count) break;
    }

    return offsets;
  }

  async jumpToPlanet(uid: string, target: Point3D) {
    const gameData = await this.prisma.gameData.findUnique({
      where: {
        uid,
      },
    });

    if (!gameData) {
      throw new RpcException(new BadRequestException('Game data not found'));
    }

    const currentShip = await this.prisma.ship.findUnique({
      where: { id: gameData.shipId },
    });

    if (!isDefined(currentShip)) {
      throw new RpcException(new BadRequestException('Current ship not found'));
    }

    if (
      gameData.x === target.x &&
      gameData.y === target.y &&
      gameData.z === target.z
    ) {
      //TODO: пуш уведомление по вебсокету
      throw new RpcException(new BadRequestException('Вы уже на этой планете'));
    }

    const pointUser: Point3D = { x: gameData.x, y: gameData.y, z: gameData.z };
    const distance = distanceBetweenCoord(pointUser, target);

    if (distance > currentShip.warpRange) {
      throw new BadRequestException('Недостаточная дальность прыжка');
    }

    const fuelPerUnit = Number(currentShip.fuelPerUnit ?? 0.01);
    const fuelNeeded = distance * fuelPerUnit;

    if ((currentShip.fuel ?? 0) < fuelNeeded) {
      throw new BadRequestException('Недостаточно топлива');
    }

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
            rarity: resource.rarity,
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

    await this.prisma.$transaction([
      this.prisma.ship.update({
        where: { id: currentShip.id },
        data: { fuel: { decrement: fuelNeeded } },
      }),
      this.prisma.gameData.update({
        where: {
          uid,
        },
        data: { ...gameData, currentPlanetId: planet.id },
      }),
      this.prisma.planetVisit.create({
        data: {
          planetId: planet.id,
          uid,
          exhausted: false,
          mined: {},
        },
      }),
    ]);

    const currentPlanet = await this.prisma.planet.findUnique({
      where: { id: planet.id },
      include: { resources: true },
    });

    return {
      planet: currentPlanet,
      message: 'Прыжок выполнен',
      distance: distance,
      fuelUsed: fuelNeeded,
    };
  }

  getPlanetBySeed(seed: string) {
    return this.prisma.planet.findUnique({
      where: { seed },
      include: { resources: true },
    });
  }

  private defineBiome(rng: () => number) {
    const n = (rng() + 1) / 2;

    if (n < 0.15) return PlanetType.ROCKY;
    if (n < 0.3) return PlanetType.LUSH;
    if (n < 0.5) return PlanetType.FROZEN;
    if (n < 0.7) return PlanetType.TOXIC;
    if (n < 0.85) return PlanetType.EXOTIC;
    return PlanetType.BLACKHOLE;
  }

  private defineRarity(rng: () => number) {
    const n = (rng() + 1) / 2;

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

  async generatePlanetBySeed(seed: string) {
    const foundPlanet = await this.prisma.planet.findUnique({
      where: { seed },
      include: { resources: true },
    });

    if (isDefined(foundPlanet)) {
      return { ...foundPlanet, isCreated: true };
    }

    const [x, y, z] = seed.split('_');

    const genPlanet = this.planetGenerate({
      x: Number(x),
      y: Number(y),
      z: Number(z),
    });
    return { ...genPlanet, isCreated: false };
  }

  //получение времени майнинга всей планеты в часах
  async getTotalTimeMiningPlanet(data: PayloadTimePlanet) {
    const { uid, seed } = data;

    let planet = await this.prisma.planet.findUnique({
      where: { seed },
      include: { resources: true },
    });

    if (!isDefined(planet)) {
      planet = await this.generatePlanetBySeed(seed);
    }

    if (!isDefined(planet))
      throw new RpcException(new NotFoundException('Не найдена планета'));

    const gameData = await this.prisma.gameData.findUnique({
      where: { uid },
      include: { ships: true },
    });

    if (!isDefined(gameData))
      throw new RpcException(
        new NotFoundException('Не найдены игровые данные'),
      );

    const ship = gameData.ships.find((ship) => ship.id === gameData.shipId);

    if (!isDefined(ship))
      throw new RpcException(
        new NotFoundException('Не найден текущий корабль'),
      );

    const miningSpeed = ship.miningPower;
    let totalMinutes = 0;

    for (const resource of planet.resources) {
      const miningRate =
        miningSpeed * RARITY_MINING_MULTIPLIER[resource.rarity];
      let maxByRemaining = resource.current;

      if ('remainingAmount' in resource)
        maxByRemaining = resource.remainingAmount as number;

      const amountToMine = Math.min(maxByRemaining, maxByRemaining);
      const timeMinutes = Math.floor(amountToMine / miningRate);
      totalMinutes += timeMinutes;
    }

    console.log({ totalMinutes });

    return {
      totalTimeMining: (totalMinutes / 60).toFixed(1),
    };
  }

  test(data: string) {
    const point: Point3D = { x: 41, y: 53, z: 90 };
    const noise1 = this.simplex(point.x, point.y, point.z);
    const noise2 = this.simplex(point.x, point.y, point.z);
    const noise3 = this.simplex(point.x, point.y, point.z);

    console.log({ noise1, noise2, noise3 });
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
