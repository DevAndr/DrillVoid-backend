import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  MS_AUTH_NAME,
  MS_AUTH_PATTERNS,
  RefreshPayload,
  Tokens,
  User,
} from '@app/contracts';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { isDefined } from '@app/core/utils';

@Injectable()
export class AuthService {
  constructor(@Inject(MS_AUTH_NAME) private readonly authClient: ClientProxy) {}

  test(uid: string) {
    return firstValueFrom(this.authClient.send(MS_AUTH_PATTERNS.TEST, uid));
  }

  loginWithTelegram(initData: string) {
    return firstValueFrom(
      this.authClient.send(MS_AUTH_PATTERNS.AUTH_WITH_TELEGRAM, initData),
    );
  }

  async refreshToken(data: RefreshPayload) {
    return firstValueFrom<Tokens>(
      this.authClient.send(MS_AUTH_PATTERNS.AUTH_REFRESH, data),
    );
  }

  async getUser(uid: string) {
    const currentUser = await firstValueFrom<User>(
      this.authClient.send(MS_AUTH_PATTERNS.AUTH_GET_USER, uid),
    );

    if (!isDefined(currentUser)) {
      throw new HttpException(`Пользователь не найден`, HttpStatus.NOT_FOUND);
    }

    return currentUser;
  }
}
