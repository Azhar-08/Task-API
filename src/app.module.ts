import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'azhar',
      database: 'postgres',
      entities: [Task],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Task]),
    TasksModule
  ],
  controllers: [],
})
export class AppModule {}
