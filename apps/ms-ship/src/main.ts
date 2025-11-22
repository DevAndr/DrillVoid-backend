import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { MsShipModule } from './ms-ship.module';
import { configRabbitMq } from '@app/core/rabbitmq/config';
import { RABBIT_MQ_QUEUE_SHIP } from '@app/contracts/ship/constsnts';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(MsShipModule);
  const configService = appContext.get(ConfigService);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MsShipModule,
    configRabbitMq(RABBIT_MQ_QUEUE_SHIP, configService, true, true),
  );

  console.log('🚀 Ship Microservice is running');

  await app.listen();
}
bootstrap();
