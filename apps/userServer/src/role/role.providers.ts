import { Role } from './role.mysql.entity';

export const RoleProviders = [
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(Role),
    inject: ['MYSQL_USER_DATA_SOURCE'],
  },
];
