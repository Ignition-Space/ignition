import { UserRole } from './user-role.mongo.entity';

export const UserRoleProviders = [
  {
    provide: 'USER_ROLE_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(UserRole),
    inject: ['MONGODB_DATA_SOURCE'],
  },
];
