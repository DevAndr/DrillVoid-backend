import { Module } from '@nestjs/common';
import { MsPlanetController } from './ms-planet.controller';
import { MsPlanetService } from './ms-planet.service';

@Module({
  imports: [],
  controllers: [MsPlanetController],
  providers: [MsPlanetService],
})
export class MsPlanetModule {}
