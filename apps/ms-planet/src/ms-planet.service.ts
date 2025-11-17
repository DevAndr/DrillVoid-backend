import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import {
  PlanetType,
  ResourceType,
} from '../../../libs/prisma/generated/prisma/enums';
import {
  BASE_AMOUNT_RESOURCE,
  PREFIXES_NAME_PLANET,
  RESOURCE_PLANET_POOL,
  SUFFIXES_NAME_PLANET,
} from './constants';

@Injectable()
export class MsPlanetService {
  private readonly logger = new Logger(MsPlanetService.name);
  constructor(private readonly prisma: PrismaService) {}

  // 🎮 ОСНОВНАЯ ФУНКЦИЯ: Генерация планеты по seed
  async generatePlanet(seed: string, sector: number = 1) {
    // Проверяем, существует ли уже (unique seed)
    const existing = await this.prisma.planet.findUnique({ where: { seed } });
    if (existing) {
      throw new BadRequestException('Planet already exists!');
    }

    const hash = this.hashSeed(seed);
    const rng = new RNG(hash);

    const typePlanet: PlanetType = this.generateType(rng);
    const name = this.generateName(rng, typePlanet);
    const capacity = this.generateCapacity(rng, typePlanet, sector);

    const planetData = {
      seed,
      name,
      type: typePlanet,
      sector,
      totalCapacity: capacity,
      currentStock: { ...capacity }, // Копия для mining
    };

    // Сохраняем в БД + создаём PlanetResource записи
    const planet = await this.prisma.planet.create({
      data: {
        ...planetData,
        planetResource: {
          create: Object.entries(capacity).map(([resourceId, totalAmount]) => ({
            typeResource: resourceId as ResourceType,
            totalAmount,
            current: totalAmount,
          })),
        },
      },
      include: { planetResource: true },
    });

    this.logger.log(
      `🌌 Generated: ${name} (${typePlanet}) in sector ${sector}`,
    );
    this.logger.log('Resources:', capacity);

    return { ...planet, ...planetData };
  }

  // Генерация бонус-планеты (лучше среднего)
  async generateBonusPlanet(uid: string) {
    const userSector = await this.getUserSector(uid);
    const bonusSeed = `bonus-${uid}-${Date.now()}-${Math.random().toString(36)}`;
    const bonusData = await this.generatePlanet(bonusSeed, userSector);
    // Улучшаем: +20% ресурсов
    Object.keys(bonusData.totalCapacity).forEach((res) => {
      bonusData.totalCapacity[res] *= 1.2;
      bonusData.currentStock[res] *= 1.2;
    });
    return bonusData;
  }

  hashSeed(seed: string) {
    let hash = 5381;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) + hash + seed.charCodeAt(i)) >>> 0; // 32-bit unsigned
    }
    return hash;
  }
  // 3. Генерация типа планеты по rarity (hash % 100 → вероятности)
  private generateType(rng: RNG): PlanetType {
    const roll = Math.floor(rng.nextFloat() * 100);
    if (roll < 30) return 'ROCKY'; // 50% common
    if (roll < 40) return 'LUSH'; // 25%
    if (roll < 50) return 'FROZEN'; // 15%
    if (roll < 70) return 'TOXIC'; // 7%
    if (roll < 90) return 'EXOTIC'; // 7%
    return 'BLACKHOLE'; // 3% legendary
  }

  generateCapacity(
    rng: RNG,
    type: PlanetType,
    sector: number,
  ): Record<string, number> {
    const pool = RESOURCE_PLANET_POOL[type];
    const capacity: Record<string, number> = {};

    // Базовые ресурсы (всегда 3-4)
    const numBase = rng.nextRange(3, 4);
    for (let i = 0; i < numBase; i++) {
      const res = pool[rng.nextInt(pool.length)];
      const [min, max] = BASE_AMOUNT_RESOURCE[res];
      const amount = Math.floor(
        rng.nextFloat() * (max - min) + min * (1 + sector * 0.2),
      ); // +20% per sector
      capacity[res] = amount;
    }

    // Редкий бонус (10% шанс)
    if (rng.nextFloat() < 0.1) {
      const rareRes = pool[rng.nextInt(pool.length)];
      capacity[rareRes] *= 3; // x3 бонус
    }

    return capacity;
  }

  scanPlanet() {}

  checkPlanetExhausted() {}

  // 5. Имя планеты (hash → sci-fi стиль)
  private generateName(rng: RNG, type: PlanetType): string {
    const typeSuffix = type.toLowerCase().slice(0, 3);
    return `${PREFIXES_NAME_PLANET[rng.nextInt(PREFIXES_NAME_PLANET.length)]}${typeSuffix}${SUFFIXES_NAME_PLANET[rng.nextInt(SUFFIXES_NAME_PLANET.length)]}`;
  }

  private async getUserSector(uid: string): Promise<number> {
    // Логика по уровню/ресурсам пользователя
    const ship = await this.prisma.ship.findUnique({
      where: { uid, isSelected: true },
    });
    return Math.floor(ship?.level || 1 / 5) + 1;
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
