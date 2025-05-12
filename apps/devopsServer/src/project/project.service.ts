import { Injectable, Inject } from '@nestjs/common';
import { MongoRepository, ObjectId } from 'typeorm';
import { Project } from './project.mongo.entity';

import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { getPaginationOptions } from '@app/common';
import { ProjectListWithPaginationDto } from './project.dto';
import { isNotEmpty } from 'class-validator';
import { UserStaredProject } from './user-star-project.mongo.entity';
import { ProjectRelationService } from './project-relation/project-relation.service';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECT_REPOSITORY')
    private readonly projectRepository: MongoRepository<Project>,
    @Inject('USER_STAR_PROJECT_REPOSITORY')
    private readonly userStarProjectRepository: MongoRepository<UserStaredProject>,
    private readonly projectRelationService: ProjectRelationService,
  ) { }

  async createOrUpdate(project: Project) {
    return this.projectRepository.save(project);
  }

  async findProjectById(projectId: number) {
    return this.projectRepository.findOne({
      where: {
        _id: new ObjectId(projectId),
      },
    });
  }

  async findProjectListByIds(mIds: number[]) {
    return this.projectRepository.find({
      where: {
        microserviceIds: { $in: mIds },
      },
    });
  }

  async paginate(
    searchParams: ProjectListWithPaginationDto,
    page: PaginationParams,
  ): Promise<Pagination<Project, CustomPaginationMeta>> {
    // 构建查询条件
    const findOptions: any = {};

    // 关键字
    if (isNotEmpty(searchParams.keyword)) {
      findOptions.$or = [
        { zhName: { $regex: searchParams.keyword, $options: 'i' } },
        { usName: { $regex: searchParams.keyword, $options: 'i' } },
        { gitProjectName: { $regex: searchParams.keyword, $options: 'i' } },
      ];
    }

    // 创建者
    if (
      Array.isArray(searchParams.creatorIds) &&
      searchParams.creatorIds.length > 0
    ) {
      findOptions.creatorId = { $in: searchParams.creatorIds };
    }

    // 项目类型
    if (searchParams?.projectTypes?.length > 0) {
      // 找出满足类型的所有项目
      const projectRelations =
        await this.projectRelationService.findRelationsByProjectTypes(
          Array.from(searchParams.projectTypes),
        );

      if (projectRelations.length > 0) {
        const projectIds = projectRelations.map((r) => r.projectId);
        findOptions._id = { $in: projectIds.map((id) => new ObjectId(id)) };
      }
    }

    // 执行分页查询
    const queryResult = await this.projectRepository.findAndCount({
      where: findOptions,
      skip: (page.currentPage - 1) * page.pageSize,
      take: page.pageSize,
      order: { createTime: 'DESC' },
    });

    return {
      items: queryResult[0],
      meta: {
        currentPage: page.currentPage,
        itemCount: queryResult[1],
        itemsPerPage: page.pageSize,
        totalItems: queryResult[1],
        totalPages: Math.ceil(queryResult[1] / page.pageSize),
      } as CustomPaginationMeta,
    };
  }

  findProjectByKeyword({ keyword, take }) {
    const findOptions: any = {};

    if (isNotEmpty(keyword)) {
      findOptions.$or = [
        { zhName: { $regex: keyword, $options: 'i' } },
        { usName: { $regex: keyword, $options: 'i' } },
      ];
    }

    return this.projectRepository.find({
      where: findOptions,
      take,
      order: { createTime: 'DESC' },
    });
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
        gitProjectId: { $in: gitIds },
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
    } as UserStaredProject;
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
        projectId: { $in: projectIds },
      },
    });
  }
}
