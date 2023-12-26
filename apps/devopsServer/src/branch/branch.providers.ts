import { Branch } from './branch.entity';

export const branchProviders = [
  {
    provide: 'BRANCH_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(Branch),
    inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
  },
];
