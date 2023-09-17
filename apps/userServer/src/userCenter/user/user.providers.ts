import { User } from './user.mysql.entity';

export const UserProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(User),
    inject: ['MYSQL_DATA_SOURCE'],
  },
];
