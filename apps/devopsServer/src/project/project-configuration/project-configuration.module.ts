import { Module } from '@nestjs/common';
import { ProjectConfigurationService } from './project-configuration.service';
import { ProjectConfigurationProviders } from './project-configuration.providers';
import { DatabaseModule } from '@app/common';

@Module({
  imports: [DatabaseModule],
  providers: [ProjectConfigurationService, ...ProjectConfigurationProviders],
  exports: [ProjectConfigurationService],
})
export class ProjectConfigurationModule { }
