import { NestFactory } from '@nestjs/core';
import { MsAuthModule } from '../../ms-auth/src/ms-auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_MQ_QUEUE } from '@app/contracts/planet/constants';
import { configRabbitMq } from '@app/core/rabbitmq/config';
import { MsPlanetModule } from './ms-planet.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(MsAuthModule);
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MsPlanetModule,
    configRabbitMq(RABBIT_MQ_QUEUE, configService, true, true),
  );

  console.log('🚀 Planet Microservice is running');

  await app.listen();
}
bootstrap();
