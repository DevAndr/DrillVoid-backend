import { Inject, Injectable } from '@nestjs/common';
import { MS_AUTH_NAME, MS_AUTH_PATTERNS, Tokens } from '@app/contracts';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject(MS_AUTH_NAME) private readonly authClient: ClientProxy) {}

  test(uid: string) {
    console.log('test');
    return firstValueFrom(this.authClient.send(MS_AUTH_PATTERNS.TEST, uid));
  }

  loginWithTelegram(initData: string) {
    return firstValueFrom(
      this.authClient.send(MS_AUTH_PATTERNS.AUTH_WITH_TELEGRAM, initData),
    );
  }

  setTokensInCookie(req: Request, tokens: Tokens) {
    // @ts-ignore
    req.res.cookie('accessToken', `${tokens.accessToken}`, {
      httpOnly: true,
      maxAge: 60000 * 5, // 5 минут              //1000 * 60 * 60 * 24 * 7, // 7 days
      secure: true,
    });

    // @ts-ignore
    req.res.cookie('refreshToken', `${tokens.refreshToken}`, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      secure: true,
    });
  }
}
