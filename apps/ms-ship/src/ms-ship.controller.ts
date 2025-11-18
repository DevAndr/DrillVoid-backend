import { Controller, Get } from '@nestjs/common';
import { MsShipService } from './ms-ship.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class MsShipController {
  constructor(private readonly msShipService: MsShipService) {}

  @Get()
  getHello(): string {
    return this.msShipService.getHello();
  }

  @EventPattern('test')
  handleScanPlanets(@Payload() uid: string) {
    console.log({ uid });
    return { data: 'test' };
  }
}
