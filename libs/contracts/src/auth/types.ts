import { User as UserTelegram } from '@telegram-apps/types/dist/dts/init-data';

export type User = {
  username: string;
  telegramId: number;
};

export type UserWithTelegram = UserTelegram &
  User & {
    isNewUser?: boolean;
  };

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type JwtPayload = {
  username?: string | null;
  telegramId: number;
  sub: string;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };

export type RefreshPayload = {
  uid: string;
  refreshToken: string;
};
