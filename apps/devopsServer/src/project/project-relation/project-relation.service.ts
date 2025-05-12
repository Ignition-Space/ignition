import { Inject, Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { SyncProjectRelationDto } from './project-relation.dto';
import { ProjectRelation } from './project-relation.mongo.entity';

@Injectable()
export class ProjectRelationService {
  constructor(
    @Inject('PROJECT_RELATION_REPOSITORY')
    private readonly projectRelationRepository: MongoRepository<ProjectRelation>,
  ) { }

  async resetProjectRelation(dto: SyncProjectRelationDto) {
    await this.projectRelationRepository.delete({
      projectId: dto.projectId,
    });

    const entities: ProjectRelation[] = dto.projectTypes.map((type) => {
      return {
        projectId: dto.projectId,
        projectType: type,
      } as ProjectRelation;
    });

    return await this.projectRelationRepository.save(entities);
  }

  findRelationsByProjectTypes(projectTypes: string[]) {
    return this.projectRelationRepository.find({
      where: {
        projectType: { $in: projectTypes },
      },
    });
  }
}
