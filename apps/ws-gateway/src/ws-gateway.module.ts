import { Module } from '@nestjs/common';
import { WsGatewayController } from './ws-gateway.controller';
import { ConfigModule } from '@app/core';
import { WsGetawayService } from './ws-gateway.service';
import { REDIS_SERVICE_NAME } from '@app/redis';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [WsGatewayController],
  providers: [
    {
      provide: REDIS_SERVICE_NAME,
      useFactory: (configService: ConfigService) => {
        return ClientsModule.register([
          {
            name: REDIS_SERVICE_NAME,
            transport: Transport.REDIS,
            options: {
              host: configService.get<string>('redis.host', 'localhost'),
              port: configService.get<number>('redis.port', 6379),
            },
          },
        ]);
      },
      inject: [ConfigService],
    },
    WsGetawayService,
  ],
})
export class WsGatewayModule {}
