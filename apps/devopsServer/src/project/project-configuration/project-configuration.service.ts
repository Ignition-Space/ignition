import { Injectable, Inject } from '@nestjs/common';
import { In, Raw, Repository } from 'typeorm';
import { ProjectConfiguration } from './project-configuration.entity';

@Injectable()
export class ProjectConfigurationService {
  constructor(
    @Inject('PROCESS_CONFIGURATION_REPOSITORY')
    private readonly projectConfigurationRepository: Repository<ProjectConfiguration>,
  ) { }

  createOrUpdate(projectConfig) {
    return this.projectConfigurationRepository.save(projectConfig);
  }

  findByProjectId(projectId) {
    return this.projectConfigurationRepository.find({
      where: { projectId }
    });
  }

  findOne(projectId, projectType) {
    return this.projectConfigurationRepository.findOne({
      where: {
        projectId,
        projectType,
      }
    });
  }
}
