import { RolePrivilege } from './role-privilege.mongo.entity';

export const rolePrivilegeProviders = [
  {
    provide: 'ROLE_PRIVILEGE_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(RolePrivilege),
    inject: ['MONGODB_DATA_SOURCE'],
  },
];
