import { NestFactory } from '@nestjs/core';
import { MsAuthModule } from './ms-auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { configRabbitMq } from '@app/core/rabbitmq/config';
import { RABBIT_MQ_QUEUE_AUTH } from '@app/contracts';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(MsAuthModule);
  const configService = appContext.get(ConfigService);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MsAuthModule,
    configRabbitMq(RABBIT_MQ_QUEUE_AUTH, configService, true, true),
  );

  console.log('🚀 Auth Microservice is running');

  await app.listen();
}
bootstrap();
