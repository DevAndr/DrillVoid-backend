import { Module } from '@nestjs/common';
import { PlanetService } from './planet.service';
import { PlanetController } from './planet.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configRabbitMq } from '@app/core/rabbitmq/config';
import {
  MS_PLANET_NAME,
  RABBIT_MQ_QUEUE,
} from '@app/contracts/planet/constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MS_PLANET_NAME,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return configRabbitMq(RABBIT_MQ_QUEUE, configService, true, true);
        },
        inject: [ConfigService],
      },
    ]),
    // ClientsModule.register([
    //   {
    //     name: 'MATH_SERVICE',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ['amqp://guest:guest@localhost:5672'],
    //       queue: 'planet-queue',
    //       queueOptions: {
    //         durable: true,
    //       },
    //     },
    //   },
    // ]),
  ],
  providers: [PlanetService],
  controllers: [PlanetController],
})
export class PlanetModule {}
