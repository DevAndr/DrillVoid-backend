import { Planet } from '../../../../libs/prisma/generated/prisma/client';

export const mapperPlanetPrisma = (planet: Planet) => {
  return {
    ...planet,
    position: { x: planet.x, y: planet.y, z: planet.z },
    biome: planet.type,
  };
};
