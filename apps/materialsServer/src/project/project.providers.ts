import { Project } from './project.mongo.entity';

export const projectProviders = [
  {
    provide: 'PROJECT_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(Project),
    inject: ['MONGODB_DATA_SOURCE'],
  },
];
