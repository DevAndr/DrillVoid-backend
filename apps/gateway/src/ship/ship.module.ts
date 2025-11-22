import { Module } from '@nestjs/common';
import { ShipService } from './ship.service';
import { ShipController } from './ship.controller';
import { ClientsModule } from '@nestjs/microservices';
import { MS_SHIP_NAME, RABBIT_MQ_QUEUE_SHIP } from '@app/contracts';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configRabbitMq } from '@app/core/rabbitmq/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MS_SHIP_NAME,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return configRabbitMq(
            RABBIT_MQ_QUEUE_SHIP,
            configService,
            true,
            true,
          );
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [ShipService],
  controllers: [ShipController],
})
export class ShipModule {}
