import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MsUserModule } from './ms-user.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(MsUserModule);
  const configService = appContext.get(ConfigService);
  const url = configService.get<string>(
    'rabbitmq.url',
    'amqp://guest:guest@localhost:5672',
  );

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MsUserModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue: 'user-queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  console.log('🚀 User Microservice is running');

  await app.listen();
}
bootstrap();
