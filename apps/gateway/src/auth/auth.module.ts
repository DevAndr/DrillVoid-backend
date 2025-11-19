import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configRabbitMq } from '@app/core/rabbitmq/config';
import { MS_AUTH_NAME, RABBIT_MQ_QUEUE_AUTH } from '@app/contracts';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MS_AUTH_NAME,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return configRabbitMq(
            RABBIT_MQ_QUEUE_AUTH,
            configService,
            true,
            true,
          );
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
