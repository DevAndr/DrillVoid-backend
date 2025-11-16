import { NestFactory } from '@nestjs/core';
import { MsShipModule } from './ms-ship.module';

async function bootstrap() {
  const app = await NestFactory.create(MsShipModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
