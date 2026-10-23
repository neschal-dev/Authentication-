import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service.js';
import { HashingService } from './hashing/hashing.service.js';
import { TokenService } from './token/token.service.js';
import { RefreshTokenService } from './token/refresh-tokens.service.js';

import { SafeUser } from '../users/interface/user.interface.js';
import { AuthResult } from './interface/auth-result.interface.js';

import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';

@Injectable()
export class AuthService {
  private dummyHashPassword?: Promise<string>;
  constructor(
    private readonly userService: UsersService,
    private readonly hashService: HashingService,
    private readonly tokenService: TokenService,
    private readonly refreshTokens: RefreshTokenService,
  ) {}

  private getDummyHash() {
    this.dummyHashPassword ??= this.hashService.hash(
      'dummy-password-for-timing',
    );
    return this.dummyHashPassword;
  }

  private async issueTokens(user: SafeUser): Promise<AuthResult> {
    const [accessToken, refresh] = await Promise.all([
      this.tokenService.signAccessToken(user.id),
      this.tokenService.signRefreshToken(user.id),
    ]);

    await this.refreshTokens.save({
      id: refresh.id,
      userId: user.id,
      token: refresh.token,
      expiresAt: refresh.expiresAt,
    });

    return { user, accessToken, refreshToken: refresh.token };
  }
  async registerUser(registerUserDto: RegisterDto): Promise<AuthResult> {
    const existingUser = await this.userService.findUserByEmail(
      registerUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException(
        'A user with this email address already exists.',
      );
    }

    const passwordHash = await this.hashService.hash(registerUserDto.password);
    const user = await this.userService.create({
      fullname: registerUserDto.fullname,
      email: registerUserDto.email,
      passwordHash,
    });

    return this.issueTokens(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResult> {
    const user = await this.userService.findUserByEmail(loginDto.email);

    // Always verify against some hash, so an unknown email costs the same time as a wrong password.
    const hashToCheck = user?.password ?? (await this.getDummyHash());
    const matches = await this.hashService.verify(
      loginDto.password,
      hashToCheck,
    );

    if (!user || !matches) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const { id, fullname, email, createdAt, updatedAt } = user;
    return await this.issueTokens({
      id,
      fullname,
      email,
      createdAt,
      updatedAt,
    });
  }

  async getProfile(userId: string): Promise<SafeUser> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    return user;
  }

  // Ends one session. Quiet on purpose: unknown or already-revoked tokens are not an error.
  async logout(dto: RefreshDto): Promise<void> {
    const stored = await this.refreshTokens.findByToken(dto.refreshToken);
    if (stored && !stored.revokedAt) {
      await this.refreshTokens.revoke(stored.id);
    }
  }

  // Ends every session of the user (all devices).
  async logoutAll(userId: string): Promise<void> {
    await this.refreshTokens.revokeAllForUser(userId);
  }

  async refresh(refreshDto: RefreshDto): Promise<AuthResult> {
    const invalid = () => new UnauthorizedException('Invalid refresh token');

    // 1. Signature, algorithm and expiry (refresh secret only).
    const payload = await this.tokenService
      .verifyRefreshToken(refreshDto.refreshToken)
      .catch(() => {
        throw invalid();
      });

    // 2. The token must be one we actually issued.
    const stored = await this.refreshTokens.findByToken(
      refreshDto.refreshToken,
    );

    if (!stored || stored.id !== payload.jti || stored.userId !== payload.sub) {
      throw invalid();
    }

    // 3. Already used before: someone else holds a copy. End every session.
    if (stored.revokedAt) {
      await this.refreshTokens.revokeAllForUser(stored.userId);

      throw invalid();
    }

    const user = await this.userService.findUserById(stored.userId);
    if (!user) {
      throw invalid();
    }

    return this.issueTokens(user);
  }
}
