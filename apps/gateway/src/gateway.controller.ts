import { Controller, Get } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  constructor(private readonly getewayService: GatewayService) {}

  @Get()
  getHello(): string {
    return this.getewayService.getHello();
  }
}
