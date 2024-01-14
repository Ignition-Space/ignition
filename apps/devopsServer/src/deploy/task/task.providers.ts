import { Task } from './task.entity';

export const taskProviders = [
  {
    provide: 'TASK_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(Task),
    inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
  },
];
