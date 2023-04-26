import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return `This action returns all users`;
  }

  findOne(input: FindOneOptions<User>) {
    return this.usersRepository.findOne(input);
  }

  create(input: DeepPartial<User>) {
    const user = this.usersRepository.create(input);
    return this.usersRepository.save(user);
  }
}
