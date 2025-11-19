import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { MsGameDataModule } from './ms-game-data.module';
import { configRabbitMq } from '@app/core/rabbitmq/config';
import { RABBIT_MQ_QUEUE_GAME_DATA } from '@app/contracts';

async function bootstrap() {
  const appContext =
    await NestFactory.createApplicationContext(MsGameDataModule);
  const configService = appContext.get(ConfigService);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MsGameDataModule,
    configRabbitMq(RABBIT_MQ_QUEUE_GAME_DATA, configService, true, true),
  );

  console.log('🚀 Game-data Microservice is running');

  await app.listen();
}
bootstrap();
