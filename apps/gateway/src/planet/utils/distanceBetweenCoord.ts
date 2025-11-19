import { Point3D } from '@app/contracts/planet/types';

export function distanceBetweenCoord(a: Point3D, b: Point3D) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}
