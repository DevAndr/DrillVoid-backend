import { Controller } from '@nestjs/common';
import { MsAuthService } from './ms-auth.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { MS_AUTH_PATTERNS, PayloadScanPlanets } from '@app/contracts';

@Controller()
export class MsAuthController {
  constructor(private readonly msAuthService: MsAuthService) {}

  @MessagePattern(MS_AUTH_PATTERNS.TEST)
  handleScanPlanets(@Payload() uid: string, @Ctx() context: RmqContext) {
    console.log(`Pattern: ${context.getPattern()}`, uid);
    return this.msAuthService.test(uid);
  }
}
