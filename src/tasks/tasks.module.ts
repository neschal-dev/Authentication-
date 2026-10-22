import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { TasksController } from './tasks.controller.js';
import { TokenService } from '../auth/token/token.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports:[AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
