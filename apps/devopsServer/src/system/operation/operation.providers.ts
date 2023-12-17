import { Operation } from './operation.entity';

export const operationProviders = [
  {
    provide: 'OPERATION_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(Operation),
    inject: ['MYSQL_DEVOPS_DATABASE_CONFIG'],
  },
];
