import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: Pick<User, 'id'>, done: CallableFunction) {
    done(null, user);
  }

  async deserializeUser(user: Pick<User, 'id'>, done: CallableFunction) {
    const fetchedUser = await this.usersService.findOne({
      where: { id: user.id },
    });
    done(null, fetchedUser);
  }
}
