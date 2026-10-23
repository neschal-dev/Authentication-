import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { SaveRefreshTokenInput } from './interface/token.interface.js';

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

  async findByToken(token: string) {
    return await this.prisma.orm.RefreshToken.where({
      tokenHash: this.hash(token),
    }).first();
  }

  // Revokes one token only if it is still active. Returns false when it was
  // already revoked, which is how two parallel uses of one token are told apart.
  async revoke(id: string): Promise<boolean> {
    const count = await this.prisma.orm.RefreshToken.where((t) => t.id.eq(id))
      .where((t) => t.revokedAt.isNull())
      .updateAndCount({ revokedAt: new Date().toISOString() });

    return count === 1;
  }

  // Ends every active session of a user (reuse detected; later: change password).
  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.orm.RefreshToken.where((t) => t.userId.eq(userId))
      .where((t) => t.revokedAt.isNull())
      .updateAndCount({ revokedAt: new Date().toISOString() });
  }
}
