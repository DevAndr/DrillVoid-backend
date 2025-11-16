import { NestFactory } from '@nestjs/core';
import { MsPlanetModule } from './ms-planet.module';

async function bootstrap() {
  const app = await NestFactory.create(MsPlanetModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
