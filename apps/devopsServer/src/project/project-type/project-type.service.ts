import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProjectType } from './project-type.entity';

@Injectable()
export class ProjectTypeService {
  constructor(
    @Inject('PROJECT_TYPE_REPOSITORY')
    private readonly projectTypeRepository: Repository<ProjectType>,
  ) { }

  findProjectTypeById(id) {
    return this.projectTypeRepository.findOne(id);
  }

  findProjectTypeByType(type: string) {
    return this.projectTypeRepository.findOne({ where: { type } });
  }

  save(projectList: ProjectType[]) {
    return this.projectTypeRepository.save(projectList);
  }

  listProjectTypes() {
    return this.projectTypeRepository.find();
  }
}
