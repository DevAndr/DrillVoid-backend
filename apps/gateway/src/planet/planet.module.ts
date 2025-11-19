import { Module } from '@nestjs/common';
import { PlanetService } from './planet.service';
import { PlanetController } from './planet.controller';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configRabbitMq } from '@app/core/rabbitmq/config';
import { MS_PLANET_NAME, RABBIT_MQ_QUEUE_PLANET } from '@app/contracts';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MS_PLANET_NAME,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return configRabbitMq(
            RABBIT_MQ_QUEUE_PLANET,
            configService,
            true,
            true,
          );
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [PlanetService],
  controllers: [PlanetController],
})
export class PlanetModule {}
