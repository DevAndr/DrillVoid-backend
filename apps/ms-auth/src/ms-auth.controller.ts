import { Controller } from '@nestjs/common';
import { MsAuthService } from './ms-auth.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { MS_AUTH_PATTERNS, RefreshPayload } from '@app/contracts';

@Controller()
export class MsAuthController {
  constructor(private readonly msAuthService: MsAuthService) {}

  @MessagePattern(MS_AUTH_PATTERNS.TEST)
  handleTest(@Payload() uid: string, @Ctx() context: RmqContext) {
    console.log(`Pattern: ${context.getPattern()}`, uid);
    return this.msAuthService.test(uid);
  }

  @MessagePattern(MS_AUTH_PATTERNS.AUTH_WITH_TELEGRAM)
  handleAuthWithTelegram(@Payload() data: string, @Ctx() context: RmqContext) {
    console.log(`Pattern: ${context.getPattern()}`, data);
    return this.msAuthService.authWitchTelegram(data);
  }

  @MessagePattern(MS_AUTH_PATTERNS.AUTH_REFRESH)
  handleRefreshAuth(data: RefreshPayload) {
    return this.msAuthService.refresh(data.uid, data.refreshToken);
  }

  @MessagePattern(MS_AUTH_PATTERNS.AUTH_GET_USER)
  handleGetUser(uid: string) {
    return this.msAuthService.getUser(uid);
  }
}
