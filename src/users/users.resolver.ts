import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Query(() => [User], { name: 'users' })
  getUsers() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  getUser(@Args('id') id: string) {
    return this.usersService.findOne({ where: { id } });
  }
}
