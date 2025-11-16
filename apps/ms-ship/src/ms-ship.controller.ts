import { Controller, Get } from '@nestjs/common';
import { MsShipService } from './ms-ship.service';

@Controller()
export class MsShipController {
  constructor(private readonly msShipService: MsShipService) {}

  @Get()
  getHello(): string {
    return this.msShipService.getHello();
  }
}
