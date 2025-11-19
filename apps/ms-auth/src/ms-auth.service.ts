import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { parseTelegramInitData } from './utils';
import { User as UserTelegram } from '@telegram-apps/init-data-node';
import { isDefined } from '@app/core/utils';
import * as argon from 'argon2';
import {
  JwtPayload,
  MS_GAME_DATA_NAME,
  MS_GAME_DATA_PATTERNS,
  Tokens,
  UserWithTelegram,
} from '@app/contracts';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MsAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(MS_GAME_DATA_NAME) private readonly gameDataClient: ClientProxy,
  ) {}

  async authWitchTelegram(initData: string) {
    try {
      const parsedData = this.parseAndValidateTelegramData(initData);

      const {
        id: telegramId,
        username,
        photo_url,
      } = parsedData.user as UserTelegram;

      if (!telegramId || !username)
        throw new HttpException(
          'Invalid Telegram Data',
          HttpStatus.BAD_REQUEST,
        );

      let user = await this.prisma.user.findUnique({
        where: {
          telegramId,
        },
      });

      const isNewUser = !isDefined(user);

      if (isNewUser) {
        const hashPassword = await argon.hash(telegramId.toString());

        user = await this.prisma.user.create({
          data: {
            username,
            urlPhoto: photo_url || '',
            telegramId,
            hashPassword,
          },
        });

        this.gameDataClient.emit(MS_GAME_DATA_PATTERNS.INITIAL, user.uid);
      }

      const tokens = await this.createTokens(
        user.uid,
        user.telegramId,
        user?.username,
      );

      await this.updateRefreshToken(user.uid, tokens.refreshToken);

      const data = {
        user: { ...parsedData.user, ...user, isNewUser } as UserWithTelegram, //TODO: вынести в тип
        tokens,
      };

      return data;
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException();
    }
  }

  test(uid: string) {
    return firstValueFrom(
      this.gameDataClient.send(MS_GAME_DATA_PATTERNS.INITIAL, uid),
    );
  }

  private async createTokens(
    id: string,
    telegramId: number,
    username?: string | null,
  ): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: id,
      username,
      telegramId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        expiresIn: '7d',
        secret: this.configService.get<string>('auth.AT_SECRET'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        expiresIn: '30d',
        secret: this.configService.get<string>('auth.RT_SECRET'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private parseAndValidateTelegramData(initData: string) {
    const parsedData = parseTelegramInitData(initData);
    this.validateTelegramUser(parsedData.user as UserTelegram);

    return parsedData;
  }

  private validateTelegramUser(user: UserTelegram) {
    if (!user?.id)
      throw new HttpException('Missing Telegram ID', HttpStatus.NOT_FOUND);

    if (!user?.username)
      throw new HttpException('Missing username', HttpStatus.NOT_FOUND);
  }

  private async updateRefreshToken(uid: string, refreshToken: string) {
    const hashRefreshToken = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: {
        uid,
      },
      data: {
        hashRefreshToken,
      },
    });
  }
}
