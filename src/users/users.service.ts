import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { DUPLICATE_KEY_ERROR_CODE } from '../constants/errors';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  findOne(input: FindOneOptions<User>) {
    return this.usersRepository.findOne(input);
  }

  async create(input: DeepPartial<User>) {
    const user = this.usersRepository.create(input);
    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === DUPLICATE_KEY_ERROR_CODE) {
        throw new ConflictException('Email already exists');
      }
    }
  }
}
