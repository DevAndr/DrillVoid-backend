import { Inject, Injectable } from '@nestjs/common';
import { MS_AUTH_NAME, MS_AUTH_PATTERNS } from '@app/contracts';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject(MS_AUTH_NAME) private readonly authClient: ClientProxy) {}

  test(uid: string) {
    console.log('test');
    return firstValueFrom(this.authClient.send(MS_AUTH_PATTERNS.TEST, uid));
  }
}
