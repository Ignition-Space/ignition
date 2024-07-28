import { Privilege } from './privilege.mysql.entity';

export const PrivilegeProviders = [
  {
    provide: 'PRIVILEGE_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(Privilege),
    inject: ['MYSQL_USER_DATA_SOURCE'],
  },
];
