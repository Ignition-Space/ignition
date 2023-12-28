import { Task } from './task.entity';

export const taskProviders = [
  {
    provide: 'TASK_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(Task),
    inject: ['DATABASE_CONNECTION'],
  },
];
