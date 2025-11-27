import { Module } from '@nestjs/common';
import { GameDataService } from './game-data.service';
import { GameDataController } from './game-data.controller';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configRabbitMq } from '@app/core/rabbitmq/config';
import { MS_GAME_DATA_NAME, RABBIT_MQ_QUEUE_GAME_DATA } from '@app/contracts';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MS_GAME_DATA_NAME,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return configRabbitMq(
            RABBIT_MQ_QUEUE_GAME_DATA,
            configService,
            true,
            true,
          );
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [GameDataService],
  controllers: [GameDataController],
})
export class GameDataModule {}
