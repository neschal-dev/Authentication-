import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    return await this.prisma.orm.User.all();
  }

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.orm.User.create(createUserDto);
  }
}
