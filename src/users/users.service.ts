import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

import { CreateUserInput, SafeUser } from './interface/user.interface.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<SafeUser | null> {
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
