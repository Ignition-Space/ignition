
import { ProjectConfiguration } from './project-configuration.entity';

export const ProjectConfigurationProviders = [
  {
    provide: 'PROCESS_CONFIGURATION_REPOSITORY',
    useFactory: (AppDataSource) =>
      AppDataSource.getRepository(ProjectConfiguration),
    inject: ['MYSQL_DEVOPS_DATABASE_CONFIG'],
  },
];
