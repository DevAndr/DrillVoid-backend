import { Controller } from '@nestjs/common';
import { WsGetawayService } from './ws-gateway.service';

@Controller()
export class WsGatewayController {
  constructor(private readonly wsGatewayService: WsGetawayService) {}
}
