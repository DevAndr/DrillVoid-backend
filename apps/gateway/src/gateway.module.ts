import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import {
  ConfigModule,
  MsResponseInterceptor,
  RequestIdMiddleware,
} from '@app/core';
import { AuthModule } from './auth/auth.module';
import { PlanetModule } from './planet/planet.module';
import { GameDataModule } from './game-data/game-data.module';
import { ShipModule } from './ship/ship.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AtGuard } from './guards';

@Module({
  imports: [ConfigModule, AuthModule, PlanetModule, GameDataModule, ShipModule],
  controllers: [GatewayController],
  providers: [
    GatewayService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MsResponseInterceptor,
    },
  ],
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
