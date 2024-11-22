import { Controller, Get, Post, Patch, Delete, Body, Param, Query, BadRequestException } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { updateLocale } from 'moment';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
 async createTask(@Body() createTaskDto: CreateTaskDto): Promise<any> {
  console.log('Received data:', createTaskDto);
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete(':id')
   async deleteTask(@Param('id') id: number) {
    return await this.tasksService.deleteTask(id);
  }

  @Patch(':id')
  async updateTask(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return await this.tasksService.updateTask(id, updateTaskDto);
  }

  @Get() 
  async getFilteredTasks(
    @Query('filter') filter: string,       // Filter type: today, thisWeek, etc.
    @Query('startDate') startDate?: string, // For custom filter: start date
    @Query('endDate') endDate?: string,     // For custom filter: end date
  ): Promise<Task[]> {
    if (filter === 'custom' && (!startDate || !endDate)) {
      throw new BadRequestException(
        'Custom filter requires both startDate and endDate.',
      );
    }
    return this.tasksService.getTasksWithFilters(filter, startDate, endDate);
  }
}
  

  
  
  


