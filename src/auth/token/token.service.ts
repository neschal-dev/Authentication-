import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import {
  AccessTokenPayload,
  RefreshTokenPayload,
  SignedRefreshToken,
} from './interface/token.interface.js';

@Injectable()
export class TokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessTtlSeconds: number;
  private readonly refreshTtlSeconds: number;

  constructor(
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    this.accessSecret = config.getOrThrow<string>('JWT_ACCESS_SECRET');
    this.refreshSecret = config.getOrThrow<string>('JWT_REFRESH_SECRET');
    this.accessTtlSeconds = Number(
      config.getOrThrow<string>('JWT_ACCESS_TTL_SECONDS'),
    );
    this.refreshTtlSeconds = Number(
      config.getOrThrow<string>('JWT_REFRESH_TTL_SECONDS'),
    );
  }
  
  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    return await this.jwt.verifyAsync<AccessTokenPayload>(token, {
      secret: this.accessSecret,
      algorithms: ['HS256'],
    });
  }

  // Uses the refresh secret only, so an access token is rejected here.
  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return await this.jwt.verifyAsync<RefreshTokenPayload>(token, {
      secret: this.refreshSecret,
      algorithms: ['HS256'],
    });
  }

  signAccessToken(userId: string): Promise<string> {
    return this.jwt.signAsync(
      { sub: userId },
      { secret: this.accessSecret, expiresIn: this.accessTtlSeconds },
    );
  }

  async signRefreshToken(userId: string): Promise<SignedRefreshToken> {
    const id = randomUUID();

    const token = await this.jwt.signAsync(
      { sub: userId },
      {
        secret: this.refreshSecret,
        expiresIn: this.refreshTtlSeconds,
        jwtid: id,
      },
    );

    const expiresAt = new Date(Date.now() + this.refreshTtlSeconds * 1000);
    return { id, token, expiresAt };
  }
}
