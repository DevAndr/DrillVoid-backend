import { Rarity, ResourceType } from '../../../prisma/generated/prisma/enums';

export type Point3D = {
  x: number;
  y: number;
  z: number;
};

export interface ScanOptions {
  count: number; // сколько планет сгенерировать
  radius: number; // радиус поиска
}

export type PayloadScanPlanets = {
  point: Point3D;
  options: ScanOptions;
};

export type ResourcePlanet = {
  type: ResourceType;
  rarity: Rarity;
  totalAmount: number;
  remainingAmount: number;
};

export type PayloadJumpToPlanet = {
  uid: string;
  target: Point3D;
};
