import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service.js';

import { CurrentUserId } from './decorator/current-user-id.decorator.js';

import { AccessTokenGuard } from './guard/access-token.guard.js';

import { RefreshDto } from './dto/refresh.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }
  @Post('login')
  @HttpCode(200)
  async loginUser(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  async me(@CurrentUserId() userId: string) {
    return this.authService.getProfile(userId);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Body() refreshDto: RefreshDto) {
    await this.authService.logout(refreshDto);
  }

  @Post('logout-all')
  @HttpCode(204)
  @UseGuards(AccessTokenGuard)
  async logoutAll(@CurrentUserId() userId: string) {
    await this.authService.logoutAll(userId);
  }
}
