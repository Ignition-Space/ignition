import { System } from './system.entity';

export const SystemProviders = [
  {
    provide: 'SYSTEM_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(System),
    inject: ['MYSQL_DEVOPS_DATABASE_CONFIG'],
  },
];
