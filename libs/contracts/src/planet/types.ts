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
