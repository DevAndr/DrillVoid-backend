import { NestFactory } from '@nestjs/core';
import { MsAuthModule } from '../../ms-auth/src/ms-auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(MsAuthModule);
  const configService = appContext.get(ConfigService);
  const url = configService.get<string>(
    'rabbitmq.url',
    'amqp://guest:guest@localhost:5672',
  );

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MsAuthModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue: 'game-data-queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  console.log('🚀 Game-data Microservice is running');

  await app.listen();
}
bootstrap();
