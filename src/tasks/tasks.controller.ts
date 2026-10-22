import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { AccessTokenGuard } from '../auth/guard/access-token.guard.js';

@Controller('tasks')
@UseGuards(AccessTokenGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }
}
