import { Module } from '@nestjs/common';
import { MsPlanetController } from './ms-planet.controller';
import { MsPlanetService } from './ms-planet.service';
import { ConfigModule } from '@app/core';

@Module({
  imports: [ConfigModule],
  controllers: [MsPlanetController],
  providers: [MsPlanetService],
})
export class MsPlanetModule {}
