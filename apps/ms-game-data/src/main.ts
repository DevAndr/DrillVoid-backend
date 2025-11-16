import { NestFactory } from '@nestjs/core';
import { MsGameDataModule } from './ms-game-data.module';

async function bootstrap() {
  const app = await NestFactory.create(MsGameDataModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
