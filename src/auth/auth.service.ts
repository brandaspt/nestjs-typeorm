import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { BcryptAdapter } from 'src/utils/bcrypt.adapter';
import { SignupInput } from './dto/signup.input';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private bcryptAdapter: BcryptAdapter,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException();
    const { hashPassword, ...rest } = user;
    const isValidPassword = await this.bcryptAdapter.compareAsync(
      pass,
      hashPassword,
    );
    if (!isValidPassword) throw new UnauthorizedException();

    return rest;
  }

  async signUp(input: SignupInput) {
    const { password, ...rest } = input;
    const hashed = await this.bcryptAdapter.hashAsync(password);
    const newUser = await this.usersService.create({
      ...rest,
      hashPassword: hashed,
    });
    return { access_token: this.jwtService.sign({ sub: newUser.id }) };
  }
}
