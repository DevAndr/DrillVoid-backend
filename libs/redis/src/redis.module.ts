import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule } from '@app/core';
import { REDIS_SERVICE_NAME } from '@app/redis/constants';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Module({
  imports: [ConfigModule],
  providers: [
    RedisService,
    {
      provide: REDIS_SERVICE_NAME,
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('redis.host', 'localhost'),
          port: configService.get<number>('redis.port', 6379),
          // password: configService.get<string>('REDIS_PASSWORD'), // Опционально
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
