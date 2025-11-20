import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PayloadLoginTelegramDto } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('test')
  test() {
    return this.authService.test('1235');
  }

  @Post('telegram')
  async loginWIthTelegram(@Req() req, @Body() data: PayloadLoginTelegramDto) {
    console.log(data);
    const authData = await this.authService.loginWithTelegram(data.initData);
    console.log(authData.tokens);
    this.authService.setTokensInCookie(req, authData?.tokens);
    return authData;
  }
}
