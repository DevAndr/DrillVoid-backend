import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class RtGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    console.log('🛡️ RtGuard activated');
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('🛡️ RtGuard handleRequest - user:', user);

    if (err || !user) {
      console.error('RtGuard error:', err || info);
      throw err || new UnauthorizedException('Refresh token invalid');
    }

    return user;
  }
}
