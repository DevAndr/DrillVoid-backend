import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PayloadLoginTelegramDto } from './types';
import { GetCurrentUser, GetCurrentUserId, Public } from '../decorators';
import { RtGuard } from '../guards';
import { isDefined } from '@app/core/utils';
import { setTokensInCookie } from './utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('test')
  test() {
    return this.authService.test('1235');
  }

  @Public()
  @Post('telegram')
  async loginWIthTelegram(@Req() req, @Body() data: PayloadLoginTelegramDto) {
    const authData = await this.authService.loginWithTelegram(data.initData);
    setTokensInCookie(req, authData?.tokens);
    return authData;
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  async refreshToken(
    @Req() req,
    @GetCurrentUserId() uid: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    // @Cookies('refreshToken') refreshToken: string,
  ) {
    if (!isDefined(refreshToken))
      throw new ForbiddenException('Access Denied. Empty a refresh token');

    const tokens = await this.authService.refreshToken({ uid, refreshToken });
    setTokensInCookie(req, tokens);
    return tokens;
  }

  @Get('me')
  getCurrentUser(@GetCurrentUserId() uid: string) {
    return this.authService.getUser(uid);
  }
}
