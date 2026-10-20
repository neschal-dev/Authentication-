import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';


@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  // @Post()
  // async createUser(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.createUser(createUserDto);
  // }
}
