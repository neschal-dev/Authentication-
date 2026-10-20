import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersModule } from '../users/users.module.js';
import { HashingService } from './hashing/hashing.service.js';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, HashingService],
})
export class AuthModule {}
