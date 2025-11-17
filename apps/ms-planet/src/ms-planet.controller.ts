import { Controller } from '@nestjs/common';
import { MsPlanetService } from './ms-planet.service';

@Controller('planet')
export class MsPlanetController {
  constructor(private readonly msPlanetService: MsPlanetService) {}
}
