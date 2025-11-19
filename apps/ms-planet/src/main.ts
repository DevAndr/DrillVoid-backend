import { NestFactory } from '@nestjs/core';
import { MsAuthModule } from '../../ms-auth/src/ms-auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { configRabbitMq } from '@app/core/rabbitmq/config';
import { MsPlanetModule } from './ms-planet.module';
import { RABBIT_MQ_QUEUE_PLANET } from '@app/contracts';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(MsAuthModule);
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MsPlanetModule,
    configRabbitMq(RABBIT_MQ_QUEUE_PLANET, configService, true, true),
  );

  console.log('🚀 Planet Microservice is running');

  await app.listen();
}
bootstrap();
