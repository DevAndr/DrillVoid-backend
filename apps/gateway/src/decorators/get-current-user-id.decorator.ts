import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '@app/contracts';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.sub;
  },
);
