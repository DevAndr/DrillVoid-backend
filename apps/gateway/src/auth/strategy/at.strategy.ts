import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    // @ts-ignore
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        AtStrategy.extractJWT,
      ]),
      secretOrKey: config.get<string>('auth.AT_SECRET', { infer: true }),
    });
  }

  private static extractJWT(req: any): string | null {
    const cookies = req.cookies;

    if (cookies) return cookies?.accessToken;

    return null;
  }

  async validate(payload: any) {
    console.log('AT strategy payload: ', payload);
    return payload;
  }
}
