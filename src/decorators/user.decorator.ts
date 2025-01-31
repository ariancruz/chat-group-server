import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ReqUser } from '../models';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): object | undefined => {
    const request: ReqUser = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
