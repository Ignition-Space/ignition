import { ProjectRelation } from './project-relation.entity';

export const projectRelationProviders = [
  {
    provide: 'PROJECT_RELATION_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(ProjectRelation),
    inject: ['DATABASE_CONNECTION'],
  },
];
