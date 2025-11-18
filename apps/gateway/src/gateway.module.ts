import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@app/core';
import { AuthModule } from './auth/auth.module';
import { PlanetModule } from './planet/planet.module';
import { GameDataModule } from './game-data/game-data.module';
import { ShipModule } from './ship/ship.module';

@Module({
  imports: [ConfigModule, AuthModule, PlanetModule, GameDataModule, ShipModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
