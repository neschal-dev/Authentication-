import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity.js';


@Injectable()

export class TasksService {
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Setup NestJS Project',
      description: 'Initialize the boilerplate and modules',
      status: 'COMPLETED',
    },
    {
      id: 2,
      title: 'Implement Guard',
      description: 'Create an AuthGuard for route protection',
      status: 'IN_PROGRESS',
    },
    {
      id: 3,
      title: 'Connect Database',
      description: 'Configure TypeORM or Mongoose connection',
      status: 'PENDING',
    },
    {
      id: 4,
      title: 'Write Unit Tests',
      description: 'Add tests for tasks controller and service',
      status: 'PENDING',
    },
    {
      id: 5,
      title: 'Deploy to Staging',
      description: 'Setup CI/CD pipeline for cloud deployment',
      status: 'PENDING',
    },
  ];

  findAll() {
    return this.tasks;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }
}
