import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreateUserInput,
  SafeUser,
  UserWithPassword,
} from './interface/user.interface.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateUserInput): Promise<SafeUser> {
    const { id, email, fullname, createdAt, updatedAt } =
      await this.prisma.orm.User.create({
        fullname: input.fullname,
        email: input.email,
        password: input.passwordHash,
      });

    return { id, email, fullname, createdAt, updatedAt };
  }

  async findUserByEmail(email: string): Promise<UserWithPassword | null> {
    return await this.prisma.orm.User.where({ email }).first();
  }

  async findUserById(id: string): Promise<SafeUser | null> {
    return this.prisma.orm.User.select(
      'id',
      'fullname',
      'email',
      'createdAt',
      'updatedAt',
    )
      .where({ id })
      .first();
  }
}
