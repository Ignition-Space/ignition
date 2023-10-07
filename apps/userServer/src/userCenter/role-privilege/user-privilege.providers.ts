import { RolePrivilege } from './role-privilege.mysql.entity';

export const rolePrivilegeProviders = [
  {
    provide: 'ROLE_PRIVILEGE_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(RolePrivilege),
    inject: ['MYSQL_DATA_SOURCE'],
  },
];
