import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    // @ts-ignore
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        RtStrategy.extractJWT,
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: config.get<string>('auth.RT_SECRET'),
    });
  }

  private static extractJWT(req: any): string | null {
    const cookies = req.cookies;
    if (cookies) return cookies?.refreshToken;

    return null;
  }

  validate(req: Request, payload: any) {
    const refreshToken = this.extractTokenFromHeader(req);

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token malformed');
    }
    return { ...payload, refreshToken };
  }

  extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return null;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
