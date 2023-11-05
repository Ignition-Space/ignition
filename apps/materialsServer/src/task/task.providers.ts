import { Task } from './task.mongo.entity';

export const TaskProviders = [
  {
    provide: 'TASK_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(Task),
    inject: ['MONGODB_DATA_SOURCE'],
  },
];
