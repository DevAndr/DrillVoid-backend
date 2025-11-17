import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { GPSPoint } from './types';
import { createNoise2D } from 'simplex-noise';
import {
  PlanetType,
  Rarity,
} from '../../../libs/prisma/generated/prisma/enums';

@Injectable()
export class MsPlanetService {
  private readonly logger = new Logger(MsPlanetService.name);
  private simplex = createNoise2D();
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

  planetGenerate(point: GPSPoint) {
    const seed = `${point.lat.toFixed(4)}_${point.lon.toFixed(4)}`;

    // 1. Biome
    const biome = this.defineBiome(point);

    // 2. Rarity
    const rarity = this.defineRarity(point);

    // 3. Resources
    const resources = this.generateResources(biome, rarity);

    return {
      name: this.generateName(seed),
      biome,
      rarity,
      resources,
      seed,
    };
  }

  private defineBiome(point: GPSPoint) {
    const noise = this.simplex(point.lat, point.lon);
    const n = (noise + 1) / 2;

    if (n < 0.15) return PlanetType.ROCKY;
    if (n < 0.3) return PlanetType.LUSH;
    if (n < 0.5) return PlanetType.FROZEN;
    if (n < 0.7) return PlanetType.TOXIC;
    if (n < 0.85) return PlanetType.EXOTIC;
    return PlanetType.BLACKHOLE;
  }

  private defineRarity(point: GPSPoint) {
    const noise = this.simplex(point.lat * 2, point.lon * 2);
    const n = (noise + 1) / 2;

    if (n < 0.6) return Rarity.COMMON;
    if (n < 0.85) return Rarity.UNCOMMON;
    if (n < 0.94) return Rarity.RARE;
    if (n < 0.99) return Rarity.EPIC;
    return Rarity.LEGENDARY;
  }

  private generateName(seed: string) {}

  private generateResources(biome: PlanetType, rarity: Rarity) {}
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
