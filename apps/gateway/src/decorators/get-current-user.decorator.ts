import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadWithRt } from '@app/contracts';
import { isDefined } from '@app/core/utils';

export const GetCurrentUser = createParamDecorator(
  (field: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    if (context?.getType && context.getType() === 'http') {
      const req = context.switchToHttp().getRequest();
      const user = req?.user;

      if (!isDefined(user)) {
        return null;
      }

      return !field ? user : user[field] || user;
    }
  },
);
