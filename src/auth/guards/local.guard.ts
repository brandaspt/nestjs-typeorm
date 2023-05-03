import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const gqlExecCtx = GqlExecutionContext.create(context);
    const { user, req } = gqlExecCtx.getContext();
    req.user = user;
    await super.logIn(req);
    return result;
  }

  getRequest(context: ExecutionContext) {
    const gqlExecCtx = GqlExecutionContext.create(context);
    const ctx = gqlExecCtx.getContext();
    const args = gqlExecCtx.getArgs();
    ctx.body = args;
    return ctx;
  }
}
