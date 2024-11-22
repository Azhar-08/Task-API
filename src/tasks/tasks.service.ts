import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import * as moment from 'moment'; // Import moment.js for date calculations
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(task);
  }

  async deleteTask(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.taskRepository.update(id, updateTaskDto);
    return this.taskRepository.findOne({ where: { id } });
  }

  async getTasksWithFilters(filter: string, startDate?: string, endDate?: string): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task');
    const today = moment().startOf('day').toISOString();
    const thisWeek = moment().startOf('week').toISOString();
    const thisMonth = moment().startOf('month').toISOString();
    const thisYear = moment().startOf('year').toISOString();

    switch (filter) {
      case 'today':
        query.where('task.dueDate >= :today', { today });
        break;
      case 'thisWeek':
        query.where('task.dueDate >= :thisWeek', { thisWeek });
        break;
      case 'thisMonth':
        query.where('task.dueDate >= :thisMonth', { thisMonth });
        break;
      case 'thisYear':
        query.where('task.dueDate >= :thisYear', { thisYear });
        break;
      case 'custom':
        if (startDate && endDate) {
          query.where('task.dueDate BETWEEN :startDate AND :endDate', { startDate, endDate });
        } else {
          throw new Error('For custom filter, startDate and endDate must be provided.');
        }
        break;
      default:
        return this.taskRepository.find(); // Return all tasks if no filter is applied
    }

    return query.getMany();
  }
}
