import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { db } from './db.js';

@Injectable()
export class PrismaService implements OnModuleDestroy {
  readonly db = db;
  readonly orm: typeof db.orm.public = db.orm.public;
  async onModuleDestroy() {
    await db.close();
  }
}
