import { Controller, Post, Body, HttpStatus, UseFilters } from '@nestjs/common';
import { ProjectService } from './project.service';
import { RepositoryService } from '../common/repository/repository.service';
import {
  BindGitRepoDto,
  CreateProjectDto,
  CreateWithGitRepoDto,
  ProjectListWithPaginationDto,
  ProjectDetailDto,
  StarProjectDto,
  UnStarProjectDto,
  ListByStatusDto,
  SetupDto,
  ProjectResponseDto,
  ProjectDetailByGitUrlDto,
  IRegisterMicroserviceDto,
  IronAppDto,
  SetupDetailDto,
} from './project.dto';
import { Project } from './project.entity';
import { ProjectType } from '@devopsServer/project/project-type/project-type.entity';
import { ProjectConfiguration } from '@devopsServer/project/project-configuration/project-configuration.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GitProjectDto } from '@devopsServer/common/repository/repository.dto';
import {
  BusinessException,
  GitlabHttpException,
  CustomPaginationMeta,
} from '@app/common';

import { Pagination } from 'nestjs-typeorm-paginate';
import { isNotEmpty } from 'class-validator';
import { ProjectTypeService } from '@devopsServer/project/project-type/project-type.service';
import { IterationService } from '@devopsServer/iteration/iteration.service';
import { OperationService } from '@devopsServer/system/operation/operation.service';
import { ProjectConfigurationService } from '@devopsServer/project/project-configuration/project-configuration.service';
import { ThirdMiniProgramConfigService } from '@devopsServer/project/third-mini-program/third-mini-program-config/third-mini-program-config.service';
import { MessagePattern, Payload as MicroPayload } from '@nestjs/microservices';

import {
  CreateProjectRecord,
  Operation,
  OperationType,
} from '@devopsServer/system/operation/operation.entity';
import { addUserStarProjectStatusToList } from './helper';
import { ConfigService } from '@nestjs/config';
import { CustomRpcExceptionFilter, PayloadUser, Public } from '@app/common';
import { pick } from 'lodash';
import { PROCESS_NODE } from '@devopsServer/utils/constants';

type ProjectGitField = {
  gitProjectId: number;
  gitNamespace: string;
  gitProjectUrl: string;
  gitProjectName: string;
  gitProjectDesc: string;
};

@ApiTags('项目')
@Controller('project')
export class ProjectController {
  private IRON_URL;
  constructor(
    private configService: ConfigService,
    private readonly projectService: ProjectService,
    private readonly projectTypeService: ProjectTypeService,
    private readonly projectConfigurationService: ProjectConfigurationService,
    private readonly repositoryService: RepositoryService,
    private readonly iterationService: IterationService,
    private readonly operationService: OperationService,
    private readonly thirdMiniProgramConfigService: ThirdMiniProgramConfigService,
  ) {
    this.IRON_URL = this.configService.get('IRON_URL');
  }

  @ApiOperation({
    summary: '创建项目',
    description:
      '创建项目不包含创建 git 仓库，但提供了一个`gitProjectId`可选字段，在创建项目的时候同时绑定 git 仓库。',
  })
  @Post('/create')
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<Project> {
    let gitProject: any = {
      gitNamespace: null,
      gitProjectUrl: null,
      gitProjectName: null,
      gitProjectDesc: null,
    };

    if (!createProjectDto.zhName) {
      createProjectDto.zhName = createProjectDto.usName;
    }

    if (isNotEmpty(createProjectDto.gitProjectId)) {
      // 校验 gitProjectId 是否已经被其它项目绑定
      gitProject = await this.getGitProjectParams(
        createProjectDto.gitProjectId,
        user.gitAccessToken,
      );
    }

    // const project: any = await cmdbProject.addProject({
    const project = await this.projectService.createOrUpdate({
      ...createProjectDto,
      ...gitProject,
      createTime: new Date(),
      creatorName: user.name,
      creatorId: user.userId,
    });

    // 保存操作记录
    const record: CreateProjectRecord = {
      projectId: project.id,
      projectName: project.zhName,
    };

    const operation: Operation = {
      operationType: OperationType.create_project,
      operatorId: user.userId,
      operatorName: user.name,
      record: JSON.stringify(record),
    };

    await this.operationService.createOrUpdate(operation);

    return project;
  }

  getGitProjectParams = (
    id: number,
    accessToken: string,
  ): Promise<ProjectGitField> => {
    return new Promise((resolve, reject) => {
      this.repositoryService
        .getProject({ id }, accessToken)
        .then((result) => {
          resolve({
            gitProjectId: result.id,
            gitNamespace: result.namespace.name,
            gitProjectUrl: result.web_url,
            gitProjectName: result.name,
            gitProjectDesc: result.description,
          });
        })
        .catch((err) => {
          // 如果是 404，未到 git 项目
          if (
            err instanceof GitlabHttpException &&
            err.getStatus() === HttpStatus.NOT_FOUND
          ) {
            resolve(null);
          } else {
            reject(err);
          }
        });
    });
  };

  @Public()
  @UseFilters(new CustomRpcExceptionFilter())
  @MessagePattern('devops.project.create')
  async microCreateProject(
    @MicroPayload()
    createDto: {
      createProjectDto: CreateProjectDto;
      user: IPayloadUser;
    },
  ) {
    return this.create(createDto.createProjectDto, createDto.user);
  }

  @ApiOperation({
    summary: '绑定 git 仓库',
    description:
      '绑定 git 仓库到项目上去。如果源项目已有绑定 git 仓库，则 git 相关字段会`被覆盖`，所以返回了一个新的项目详情信息',
  })
  @Post('/bindGitRepo')
  async bindGitRepo(
    @Body() bindGitRepoDto: BindGitRepoDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<Project> {
    const project = await this.projectService.findProjectById(
      bindGitRepoDto.projectId,
    );

    if (!project) {
      throw new BusinessException('未查找到项目');
    }

    if (isNotEmpty(project.gitProjectId)) {
      throw new BusinessException('该项目已绑定 git 仓库，禁止更换绑定。');
    }

    const gitProject = await this.getGitProjectParams(
      bindGitRepoDto.gitProjectId,
      user.gitAccessToken,
    );

    if (!gitProject) {
      throw new BusinessException('未找到 git 仓库地址');
    }

    return await this.projectService.createOrUpdate({
      ...project,
      ...gitProject,
    });
  }

  @ApiOperation({
    summary: '创建带 git 仓库的项目',
    description: '创建项目同时创建 git 仓库',
  })
  @Post('/createWithGitRepo')
  async createWithGitRepo(
    @Body() createWithGitRepoDto: CreateWithGitRepoDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<Project> {
    const gitParams: GitProjectDto = {
      namespace_id: createWithGitRepoDto.gitNamespaceId,
      path: '', // 如果提供了 name，可以不需要该字段
      name: createWithGitRepoDto.gitProjectName,
      description: createWithGitRepoDto.desc,
    };
    const gitProject = await this.repositoryService.createProject(
      gitParams,
      user.gitAccessToken,
    );
    if (!gitProject) {
      throw new BusinessException('创建 git 仓库失败');
    }

    const project: Project = {
      creatorName: user.name,
      creatorId: user.userId,
      zhName: createWithGitRepoDto.zhName,
      usName: createWithGitRepoDto.usName,
      desc: createWithGitRepoDto.desc,
      projectTypes: createWithGitRepoDto.projectTypes,
      gitProjectName: gitProject.name,
      gitProjectId: gitProject.id,
      gitNamespace: gitProject.namespace.name,
      gitProjectUrl: gitProject.webUrl,
      gitProjectDesc: gitProject.description,
    };
    return await this.projectService.createOrUpdate(project);
  }

  @ApiOperation({
    summary: '获取项目详情',
  })
  @Post('/GetDetailByGitUrl')
  async findProjectByGitUrl(
    @Body() projectDetailDto: ProjectDetailByGitUrlDto,
  ): Promise<ProjectResponseDto> {
    const project: Project = await this.projectService.findProjectByGitUrl(
      projectDetailDto.gitUrl,
    );
    return project;
  }

  @ApiOperation({
    summary: '获取项目详情',
  })
  @Post('/detail')
  async findProjectById(
    @Body() projectDetailDto: ProjectDetailDto,
  ): Promise<ProjectResponseDto> {
    const project: Project = await this.projectService.findProjectById(
      projectDetailDto.id,
    );
    // const project: any = await cmdbProject.getProject(projectDetailDto.id);

    if (!project) {
      throw new BusinessException('未查到项目');
    }

    const third = project.projectTypes.filter((types) => {
      return types.includes('3rd');
    });

    // 同步第三方小程序配置
    if (third.length > 0) {
      const reThirdConfig =
        await this.thirdMiniProgramConfigService.findByProjectId({
          projectId: project.id,
        });
      const thirdConfig = {};
      PROCESS_NODE['weapp3rd'].forEach((nodes) => {
        const result = reThirdConfig.filter(
          (third) => third.environment === nodes.env,
        );
        thirdConfig[nodes.env] =
          result.length > 0
            ? result[0]
            : { interface: '', config: {}, status: 0 };
      });
      return {
        ...project,
        thirdConfig,
      };
    }
    return {
      ...project,
    };
  }

  @ApiOperation({
    summary: '通过关键词查找项目',
  })
  @Post('list/search')
  async findProjectByKeyword(
    @Body() { keyword, take = 10 }: { keyword: string; take: number },
  ) {
    const list = await this.projectService.findProjectByKeyword({
      keyword,
      take,
    });
    return list;
  }

  @Public()
  @UseFilters(new CustomRpcExceptionFilter())
  @MessagePattern('devops.project.getDetail')
  async microGetDetail(@MicroPayload() projectDetailDto: ProjectDetailDto) {
    console.log('projectDetailDto==>', projectDetailDto);
    return this.findProjectById(projectDetailDto);
  }

  @ApiOperation({
    summary: '项目列表（分页）',
  })
  @Post('list/pagination')
  async listWithPagination(
    @Body() listWithPaginationDto: ProjectListWithPaginationDto,
    @PayloadUser() user?: IPayloadUser,
  ): Promise<Pagination<Project, CustomPaginationMeta>> {
    const { page, ...searchParams } = listWithPaginationDto;
    const pageData = await this.projectService.paginate(searchParams, page);
    // 添加用户关注项目状态
    let newList = [];
    if (user) {
      newList = await addUserStarProjectStatusToList(
        user,
        pageData.items,
        this.projectService,
      );
    }

    return { ...pageData, items: newList };
  }

  @Public()
  @UseFilters(new CustomRpcExceptionFilter())
  @MessagePattern('devops.project.getList')
  async microListWithPagination(
    @MicroPayload() listWithPaginationDto: ProjectListWithPaginationDto,
  ) {
    return this.listWithPagination(listWithPaginationDto);
  }

  @ApiOperation({
    summary: '通过状态查项目列表',
    description: '列出只包含自己参与的项目',
  })
  @Post('list/byStatus')
  async listByStatus(@Body() listByStatusDto: ListByStatusDto) {
    // 根据迭代状态获取项目 id。
    if (Array.isArray(listByStatusDto.status)) {
      const iterations = await this.iterationService.list({
        status: listByStatusDto.status,
      });

      const ids = iterations.map((it) => it.projectId);

      return this.projectService.findProjectListByIds(ids);
    }

    return [];
  }

  @ApiOperation({
    summary: '关注单个项目',
  })
  @Post('star')
  async starProject(
    @Body() starProjectDto: StarProjectDto,
    @PayloadUser() user: IPayloadUser,
  ) {
    const userStarProject = await this.projectService.findStarProject(
      user.userId,
      starProjectDto.projectId,
    );
    if (userStarProject) {
      throw new BusinessException('项目已关注，无需重复关注哦！');
    }

    return await this.projectService.starProject(
      user.userId,
      starProjectDto.projectId,
    );
  }

  @ApiOperation({
    summary: '删除单个项目',
  })
  @Post('delProject')
  async delProject(
    @Body() starProjectDto: StarProjectDto,
    @PayloadUser() user: IPayloadUser,
  ) {
    // return cmdbProject.deleteProject(starProjectDto.projectId);

    const userStarProject = await this.projectService.findProjectById(
      starProjectDto.projectId,
    );
    return await this.projectService.delProject({
      ...userStarProject,
      creatorName: user.name,
      creatorId: user.userId,
    });
  }

  @ApiOperation({
    summary: '【IRON】删除单个项目',
  })
  @Post('delProjectNew')
  async delProjectNew(
    @Body() ironAppDto: IronAppDto,
    @PayloadUser() user: IPayloadUser,
  ) {
    return await this.delProject({ projectId: ironAppDto.jobId }, user);
  }

  @Post('unStar')
  @ApiOperation({
    summary: '取消关注单个项目',
  })
  async unStarProject(
    @Body() unStarProjectDto: UnStarProjectDto,
    @PayloadUser() user: IPayloadUser,
  ) {
    const userStarProject = await this.projectService.findStarProject(
      user.userId,
      unStarProjectDto.projectId,
    );
    if (!userStarProject) {
      throw new BusinessException('项目未关注，无需取消关注哦！');
    }
    return this.projectService.unStarProject(userStarProject);
  }

  @Post('list/starred')
  @ApiOperation({
    summary: '已关注的项目列表',
    description:
      '关注的项目依赖于 gitlab 的实现，所以只列出绑定过 git 仓库的项目。如果没有查出你关注的项目，请先绑定 git 仓库到项目。',
  })
  async getProjectList(@PayloadUser() user: IPayloadUser) {
    const userStaredProjects = await this.projectService.getStarProjectList(
      user.userId,
    );

    if (!Array.isArray(userStaredProjects) || userStaredProjects.length === 0) {
      return [];
    }

    const projectIds = userStaredProjects.map((item) => item.projectId);

    const projectList =
      await this.projectService.findProjectListByIds(projectIds);

    return projectList;
  }

  @Post('setup')
  @ApiOperation({
    summary: '项目设置',
  })
  async setup(@Body() setupDto: SetupDto) {
    console.log('setupDto', setupDto);
    const { baseInfo, ...rest } = setupDto;
    const project: Project = await this.projectService.findProjectById(
      setupDto.projectId,
    );

    if (!project) {
      throw new BusinessException('项目不存在！');
    }

    const updatedProject: Project = {
      ...project,
      ...baseInfo,
    };

    if (!setupDto.projectType) {
      return this.projectService.createOrUpdate(updatedProject);
      // return cmdbProject.updateProject(updatedProject);
    }

    // cmdbProject.updateProject(updatedProject);
    this.projectService.createOrUpdate(updatedProject);

    const projectType: ProjectType =
      await this.projectTypeService.findProjectTypeByType(setupDto.projectType);

    const projectConfig: ProjectConfiguration =
      await this.projectConfigurationService.findOne(
        project.id,
        projectType.type,
      );

    const updatedProjectConfig: ProjectConfiguration = {
      ...projectConfig,
      ...rest,
    };

    if (projectType.type === 'webapp' || projectType.type === 'weapp3rd') {
      const authentication: any =
        projectConfig?.authentication &&
        JSON.parse(projectConfig.authentication);

      updatedProjectConfig.authentication = JSON.stringify({
        secretToken: setupDto.secretToken || authentication?.secretToken,
        appId: setupDto.appId || authentication?.appId,
        componentAppId:
          setupDto.componentAppId || authentication?.componentAppId,
      });
    }

    return this.projectConfigurationService.createOrUpdate(
      updatedProjectConfig,
    );
  }

  @Post('setup/basic')
  @ApiOperation({
    summary: '项目基础设置',
  })
  async setupBasic(@Body() setupDetailDto: SetupDetailDto) {
    return this.setup(pick(setupDetailDto, ['projectId', 'baseInfo']));
  }

  @Public()
  @UseFilters(new CustomRpcExceptionFilter())
  @MessagePattern('devops.project.update')
  async microSetup(
    @MicroPayload()
    SetupDto,
  ) {
    return this.setup(SetupDto);
  }

  @Post('/project/users')
  async getProjectUsers(
    @Body() projectDetailDto: ProjectDetailDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<any> {
    const project = await this.projectService.findProjectById(
      projectDetailDto.id,
    );
    return this.repositoryService.getProjectUsers(
      project.gitProjectId,
      user.gitAccessToken,
    );
  }

  @ApiOperation({
    summary: '关联微服务',
  })
  @Post('/project/registerMicroservice')
  async registerMicroservice(
    @Body() registerMicroserviceDto: IRegisterMicroserviceDto,
    @PayloadUser() user: IPayloadUser,
  ): Promise<any> {
    const project = await this.projectService.findProjectById(
      registerMicroserviceDto.id,
    );
    return this.projectService.createOrUpdate({
      ...project,
      microserviceIds: registerMicroserviceDto.MicrosIds,
    });
  }

  @ApiOperation({
    summary: '查询关联的微服务',
  })
  @Post('/project/getMicroserviceList')
  async getMicroserviceList(
    @Body() projectDetailDto: ProjectDetailDto,
  ): Promise<any> {
    const project = await this.projectService.findProjectById(
      projectDetailDto.id,
    );
    if (project.microserviceIds) {
      const microserviceList = await this.projectService.findProjectListByIds(
        project.microserviceIds,
      );
      return microserviceList;
    }
    return [];
  }

  @ApiOperation({
    summary: '删除关联的微服务',
  })
  @Post('/project/delMicroserviceList')
  async delMicroserviceList(
    @Body() projectDetailDto: IRegisterMicroserviceDto,
  ): Promise<any> {
    const project = await this.projectService.findProjectById(
      projectDetailDto.id,
    );
    return this.projectService.createOrUpdate({
      ...project,
    });
  }
}
