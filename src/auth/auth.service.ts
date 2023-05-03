import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupInput } from './dto/signup.input';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne({
      where: { email },
      select: { hashPassword: true, id: true },
    });
    if (!user) throw new UnauthorizedException();
    const { hashPassword, id } = user;
    const isValidPassword = await compare(password, hashPassword);
    if (!isValidPassword) throw new UnauthorizedException();

    return { id };
  }

  async signUp(input: SignupInput) {
    const { password, ...rest } = input;
    const hashed = await hash(password, 12);
    const newUser = await this.usersService.create({
      ...rest,
      hashPassword: hashed,
    });
    return { userId: newUser.id };
  }
}
