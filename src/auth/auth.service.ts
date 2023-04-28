import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupInput } from './dto/signup.input';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOne({
      where: { email },
      select: { hashPassword: true, id: true },
    });
    if (!user) throw new UnauthorizedException();
    const { hashPassword, id } = user;
    const isValidPassword = await compare(pass, hashPassword);
    if (!isValidPassword) throw new UnauthorizedException();

    return id;
  }

  async signUp(input: SignupInput) {
    const { password, ...rest } = input;
    const hashed = await hash(password, 12);
    const newUser = await this.usersService.create({
      ...rest,
      hashPassword: hashed,
    });
    return { access_token: this.jwtService.sign({ sub: newUser.id }) };
  }

  async login(userId: string) {
    return { access_token: this.jwtService.sign({ sub: userId }) };
  }
}
