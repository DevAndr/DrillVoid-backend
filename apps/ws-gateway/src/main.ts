import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { WsGatewayModule } from './ws-gateway.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { configRabbitMq } from '@app/core/rabbitmq/config';
import { MS_RABBIT_MQ_QUEUES } from '@app/core/rabbitmq/constants';

async function bootstrap() {
  const app = await NestFactory.create(WsGatewayModule);
  app.use(cookieParser());
  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('ws-getaway.PORT', 3040);

  app.connectMicroservice<MicroserviceOptions>(
    configRabbitMq(
      MS_RABBIT_MQ_QUEUES.SOCKET_EVENTS,
      configService,
      true,
      true,
    ),
  );

  await app.startAllMicroservices();
  await app.listen(port, () =>
    console.log(`🚀 WS-Getaway is running on port ${port}`),
  );
}
bootstrap();
