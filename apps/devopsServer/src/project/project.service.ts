import { Injectable, Inject } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { Project } from './project.entity';

import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { getPaginationOptions } from '@app/common';
import { ProjectListWithPaginationDto } from './project.dto';
import { isNotEmpty } from 'class-validator';
import { In } from 'typeorm';
import { UserStaredProject } from './user-star-project.entity';
import { ProjectRelationService } from './project-relation/project-relation.service';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECT_REPOSITORY')
    private readonly projectRepository: Repository<Project>,
    @Inject('USER_STAR_PROJECT_REPOSITORY')
    private readonly userStarProjectRepository: Repository<UserStaredProject>,
    private readonly projectRelationService: ProjectRelationService,
  ) { }

  async createOrUpdate(project: Project) {
    return this.projectRepository.save(project);
  }

  async findProjectById(projectId: number) {
    return this.projectRepository.findOne({
      where: {
        id: projectId,
      },
    });
  }

  async findProjectListByIds(mIds: number[]) {
    return this.projectRepository.find({
      where: {
        microserviceIds: In(mIds),
      },
    });
  }

  async paginate(
    searchParams: ProjectListWithPaginationDto,
    page: PaginationParams,
  ): Promise<Pagination<Project, CustomPaginationMeta>> {
    const queryBuilder = this.projectRepository.createQueryBuilder('project');
    queryBuilder.where('project.deleted_at is null');
    queryBuilder.andWhere('project.app_type = "web"');

    queryBuilder.orderBy('project.fcreate_time', 'DESC');

    // 关键字
    if (isNotEmpty(searchParams.keyword)) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('project.zh_name LIKE :name', {
            name: `%${searchParams.keyword}%`,
          })
            .orWhere('project.fjob_name LIKE :name', {
              name: `%${searchParams.keyword}%`,
            })
            .orWhere('project.git_project_name LIKE :name', {
              name: `%${searchParams.keyword}%`,
            });
        }),
      );
    }

    // 创建者
    if (
      Array.isArray(searchParams.creatorIds) &&
      searchParams.creatorIds.length > 0
    ) {
      queryBuilder.andWhere('project.feid IN (:...ids)', {
        ids: searchParams.creatorIds,
      });
    }

    // 项目类型
    if (searchParams?.projectTypes?.length > 0) {
      // 找出满足类型的所有项目
      const projectRelations =
        await this.projectRelationService.findRelationsByProjectTypes(
          Array.from(searchParams.projectTypes),
        );
      const projectIds: Set<number> = new Set();
      projectRelations.forEach((r) => {
        projectIds.add(r.projectId);
      });
      if ([...projectIds].length > 0) {
        queryBuilder.andWhere('project.fid IN (:...ids)', {
          ids: [...projectIds],
        });
      }
    }

    const pageData = await paginate(queryBuilder, getPaginationOptions(page));

    return {
      items: pageData.items,
      meta: pageData.meta,
    };
  }

  findProjectByKeyword({ keyword, take }) {
    const queryBuilder = this.projectRepository.createQueryBuilder('project');
    queryBuilder.where('project.deleted_at is null');
    console.log('keyword: ' + keyword);
    queryBuilder.orderBy('project.fcreate_time', 'DESC');
    // 关键字
    if (isNotEmpty(keyword)) {
      queryBuilder.andWhere('project.zh_name LIKE :name', {
        name: `%${keyword}%`,
      });
      queryBuilder.orWhere('project.fjob_name LIKE :name', {
        name: `%${keyword}%`,
      });
    }
    return queryBuilder.take(take).getMany();
  }

  async findProjectByGitUrl(gitProjectUrl: string) {
    return this.projectRepository.findOne({
      where: {
        gitProjectUrl,
      },
    });
  }

  async findProjectListByGitIds(gitIds: number[]) {
    return this.projectRepository.find({
      where: {
        gitProjectId: In(gitIds),
      },
    });
  }

  getStarProjectList(userId: number) {
    return this.userStarProjectRepository.find({
      where: {
        userId,
      },
    });
  }

  findStarProject(userId: number, projectId: number) {
    return this.userStarProjectRepository.findOne({
      where: {
        userId,
        projectId,
      },
    });
  }

  starProject(userId: number, projectId: number) {
    const userStarProject: UserStaredProject = {
      userId,
      projectId,
    };
    return this.userStarProjectRepository.save(userStarProject);
  }

  async delProject(project) {
    return this.projectRepository.delete(project);
  }

  unStarProject(userStarProject: UserStaredProject) {
    return this.userStarProjectRepository.delete(userStarProject);
  }

  getStarProjectListByIds(projectIds: number[], user: IPayloadUser) {
    return this.userStarProjectRepository.find({
      where: {
        userId: user.userId,
        projectId: In(projectIds),
      },
    });
  }
}
