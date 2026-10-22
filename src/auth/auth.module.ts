import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersModule } from '../users/users.module.js';
import { HashingService } from './hashing/hashing.service.js';
import { TokenService } from './token/token.service.js';
import { RefreshTokenService } from './token/refresh-tokens.service.js';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from './guard/access-token.guard.js';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  exports: [AccessTokenGuard, TokenService],
  controllers: [AuthController],
  providers: [
    AuthService,
    HashingService,
    TokenService,
    RefreshTokenService,
    AccessTokenGuard,
  ],
})
export class AuthModule {}
