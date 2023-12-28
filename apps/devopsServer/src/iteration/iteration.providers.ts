import { Iteration } from './iteration.entity';

export const iterationProviders = [
  {
    provide: 'ITERATION_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(Iteration),
    inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
  },
];
