import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createHash } from 'crypto';
import { SaveRefreshTokenInput } from './interface/token.interface';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly prisma: PrismaService) {}

  hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async save(input: SaveRefreshTokenInput): Promise<void> {
    await this.prisma.orm.RefreshToken.create({
      id: input.id,
      userId: input.userId,
      tokenHash: this.hash(input.token),
      expiresAt: input.expiresAt.toISOString(),
    });
  }
}
