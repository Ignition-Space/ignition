import { Privilege } from './privilege.mongo.entity';

export const PrivilegeProviders = [
  {
    provide: 'PRIVILEGE_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(Privilege),
    inject: ['MONGODB_DATA_SOURCE'],
  },
];
