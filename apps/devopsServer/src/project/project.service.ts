import { Injectable, Inject } from '@nestjs/common';
import { Brackets, IsNull, Repository } from 'typeorm';
import { Project } from './project.entity';

import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { getPaginationOptions } from '@app/common';
import { ProjectListWithPaginationDto } from './project.dto';
import { isNotEmpty } from 'class-validator';
import { In } from 'typeorm';
import { UserStaredProject } from './user-star-project.entity';
import { transformJobToProject, transformProjectToJob } from './helper';

@Injectable()
export class ProjectService {
  constructor(
    // @Inject('PROJECT_REPOSITORY')
    // private readonly projectRepository: Repository<Project>,
    @Inject('USER_STAR_PROJECT_REPOSITORY')
    private readonly userStarProjectRepository: Repository<UserStaredProject>,
  ) { }

  async createOrUpdate(project: Project) {
    const resultProject: Project = transformJobToProject(
      await this.jenkinsProjectJobService.save(transformProjectToJob(project)),
    );

    return resultProject;
  }

  async findProjectById(projectId: number, withRelation?: boolean) {
    const app = await this.jenkinsProjectJobService.findOne({
      where: { fid: projectId },
    });
    if (!app) return null;
    const project = {
      ...transformJobToProject(app),
      fprojectId: null,
    };
    return project;
  }

  async findProjectByGitUrl(gitlabUrl: string) {
    return transformJobToProject(
      await this.jenkinsProjectJobService.findOne({
        where: { fgitlabUrl: gitlabUrl },
      }),
    );
  }

  async findProjectListByGitIds(gitIds: number[]) {
    return (
      await this.jenkinsProjectJobService.find({
        where: {
          fgitlabProjectId: In(gitIds),
          deletedAt: IsNull(),
          appType: 'web',
        },
      })
    ).map(transformJobToProject);
  }

  async findProjectListByIds(ids: number[], take: number) {
    return (
      await this.jenkinsProjectJobService.find({
        where: {
          fid: In(ids),
        },
        take: take || 100,
      })
    ).map(transformJobToProject);
  }

  async findProjectByGitProjectId(gitProjectId: number) {
    return transformJobToProject(
      await this.jenkinsProjectJobService.findOne({
        where: {
          fgitlabProjectId: gitProjectId,
          deletedAt: IsNull(),
          appType: 'web',
        },
      }),
    );
  }

  findProjectByKeyword({ keyword, take }) {
    const queryBuilder =
      this.jenkinsProjectJobService.createQueryBuilder('project');
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

  async paginate(
    searchParams: ProjectListWithPaginationDto,
    page: PaginationParams,
  ): Promise<Pagination<Project, CustomPaginationMeta>> {
    const queryBuilder =
      this.jenkinsProjectJobService.createQueryBuilder('project');
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

    const pageData = await paginate<TJenkinsProjectJob, CustomPaginationMeta>(
      queryBuilder,
      getPaginationOptions(page),
    );

    return {
      items: pageData.items.map(transformJobToProject),
      meta: pageData.meta,
    };
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
    const resultProject: Project = transformJobToProject(
      await this.jenkinsProjectJobService.save({
        ...transformProjectToJob(project),
        deletedAt: new Date(),
      }),
    );

    return resultProject;
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
