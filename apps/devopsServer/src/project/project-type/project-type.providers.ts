import { ProjectType } from './project-type.entity';

export const projectTypeProviders = [
  {
    provide: 'PROJECT_TYPE_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(ProjectType),
    inject: ['MYSQL_DEVOPS_DATABASE_CONFIG'],
  },
];
