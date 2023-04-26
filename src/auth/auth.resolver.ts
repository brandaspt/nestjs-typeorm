import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/signup.input';
import { AuthResponse } from './dto/auth-response';
import { UseGuards } from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  signUp(@Args('input') input: SignupInput) {
    return this.authService.signUp(input);
  }

  @Mutation(() => AuthResponse)
  @UseGuards(LocalGuard)
  login(
    @Args('email') _email: string,
    @Args('password') _password: string,
    @Context() context,
  ) {
    return this.authService.login(context.user);
  }
}
