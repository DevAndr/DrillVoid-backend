import { Module } from '@nestjs/common';
import { MsAuthController } from './ms-auth.controller';
import { MsAuthService } from './ms-auth.service';
import { ConfigModule } from '@app/core';
import { PrismaModule } from '@app/prisma';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { configRabbitMq } from '@app/core/rabbitmq/config';
import { MS_GAME_DATA_NAME, RABBIT_MQ_QUEUE_GAME_DATA } from '@app/contracts';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    JwtModule,
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
  controllers: [MsAuthController],
  providers: [MsAuthService],
})
export class MsAuthModule {}
