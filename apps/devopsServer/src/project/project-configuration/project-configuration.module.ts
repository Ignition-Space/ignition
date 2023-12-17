import { Module } from '@nestjs/common';
import { ProjectConfigurationService } from './project-configuration.service';
import { ProjectConfigurationProviders } from './project-configuration.providers';
import { DatabaseModule } from '@devopsServer/common/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ProjectConfigurationService, ...ProjectConfigurationProviders],
  exports: [ProjectConfigurationService],
})
export class ProjectConfigurationModule { }
