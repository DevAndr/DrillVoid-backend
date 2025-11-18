import { Controller, Get } from '@nestjs/common';
import { ShipService } from './ship.service';

@Controller('ship')
export class ShipController {
  constructor(private readonly shipService: ShipService) {}
  @Get('test')
  handleTest() {
    this.shipService.test();
    return 'test';
  }
}
