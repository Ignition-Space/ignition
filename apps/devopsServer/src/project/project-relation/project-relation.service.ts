import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { SyncProjectRelationDto } from './project-relation.dto';
import { ProjectRelation } from './project-relation.entity';

@Injectable()
export class ProjectRelationService {
  constructor(
    @Inject('PROJECT_RELATION_REPOSITORY')
    private readonly projectRelationRepository: Repository<ProjectRelation>,
  ) { }

  async resetProjectRelation(dto: SyncProjectRelationDto) {
    await this.projectRelationRepository.delete({
      projectId: dto.projectId,
    });

    const entities: ProjectRelation[] = dto.projectTypes.map((type) => {
      return {
        projectId: dto.projectId,
        projectType: type,
      };
    });

    return await this.projectRelationRepository.save(entities);
  }

  findRelationsByProjectTypes(projectTypes: string[]) {
    return this.projectRelationRepository.find({
      where: {
        projectType: In(projectTypes),
      },
    });
  }
}
