import { System } from './system.mongo.entity';

export const systemProviders = [
  {
    provide: 'SYSTEM_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(System),
    inject: ['MONGODB_DATA_SOURCE'],
  },
];
