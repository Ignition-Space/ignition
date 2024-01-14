import { Module } from '@nestjs/common';
import { ProjectConfigurationService } from './project-configuration.service';
import { DatabaseModule } from '@app/common';
import { ProjectConfiguration } from './project-configuration.entity';

@Module({
  imports: [DatabaseModule],
  providers: [
    ProjectConfigurationService,
    {
      provide: 'PROCESS_CONFIGURATION_REPOSITORY',
      useFactory: (AppDataSource) =>
        AppDataSource.getRepository(ProjectConfiguration),
      inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
    },
  ],
  exports: [ProjectConfigurationService],
})
export class ProjectConfigurationModule { }
