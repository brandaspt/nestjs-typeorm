import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    console.log('at guard');
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
