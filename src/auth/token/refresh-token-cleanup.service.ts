import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RefreshTokenService } from './refresh-tokens.service.js';

@Injectable()
export class RefreshTokenCleanupService {
  private readonly logger = new Logger(RefreshTokenCleanupService.name);

  constructor(private readonly refreshTokens: RefreshTokenService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async purgeExpired(): Promise<void> {
    try {
      const removed = await this.refreshTokens.deleteExpired();
      this.logger.log(`Removed ${removed} expired refresh token(s)`);
    } catch (error) {
      // A failed cleanup must never crash the app; it will run again tomorrow.
      this.logger.error('Refresh token cleanup failed', error);
    }
  }
}
