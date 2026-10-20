import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersService } from '../users/users.service.js';
import { HashingService } from './hashing/hashing.service.js';

@Module({
  imports: [UsersService],
  controllers: [AuthController],
  providers: [AuthService, HashingService],
})
export class AuthModule {}
