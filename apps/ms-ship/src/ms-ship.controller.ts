import { Controller } from '@nestjs/common';
import { MsShipService } from './ms-ship.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class MsShipController {
  constructor(private readonly msShipService: MsShipService) {}

  @EventPattern('test')
  handleScanPlanets(@Payload() uid: string) {
    console.log({ uid });
    return { data: 'test' };
  }
}
