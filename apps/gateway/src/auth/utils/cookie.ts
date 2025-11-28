import { Tokens } from '@app/contracts';

export const setTokensInCookie = (req: Request, tokens: Tokens) => {
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
};
