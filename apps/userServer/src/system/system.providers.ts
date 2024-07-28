import { System } from './system.mysql.entity';

export const systemProviders = [
  {
    provide: 'SYSTEM_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(System),
    inject: ['MYSQL_USER_DATA_SOURCE'],
  },
];
