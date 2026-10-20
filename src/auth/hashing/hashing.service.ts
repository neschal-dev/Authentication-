import * as argon2 from 'argon2';

import { Injectable } from '@nestjs/common';

@Injectable()
export class HashingService {
  async hash(plain: string): Promise<string> {
    return await argon2.hash(plain);
  }

  async verify(plain: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, plain);
  }
}
