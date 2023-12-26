import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BusinessException } from '@app/common';
import { Project } from '@devopsServer/project/project.entity';
import { ProjectService } from '@devopsServer/project/project.service';
import {
  CompleteIterationDto,
  CreateIterationDto,
  DisableIterationDto,
  ListItWithPaginationDto,
  DisableActivePlanItDto,
  UpdateStatusDto,
  ValidIterationDto,
} from './iteration.dto';
import {
  Iteration,
  IterationStatus,
  updateVersionType,
} from './iteration.entity';

import { Branch } from '@devopsServer/branch/branch.entity';

import { IterationService } from './iteration.service';

import { Pagination } from 'nestjs-typeorm-paginate';
import { getBranchPrefix } from '@devopsServer/utils/helper';
import { ProcessService } from '@devopsServer/iteration/process/process.service';
import {
  Process,
  ProcessNodes,
} from '@devopsServer/iteration/process/process.entity';
import { BranchService } from '@devopsServer/branch/branch.service';
import { RepositoryService } from '@devopsServer/common/repository/repository.service';
import {
  ApplyForTesting,
  OperationType,
} from '@devopsServer/system/operation/operation.entity';
import { OperationService } from '@devopsServer/system/operation/operation.service';
import { ProcessFlowService } from './process/processFlow/processFlow.service';
import { ProcessNodeService } from './process/processNode/processNode.service';
import { IterationHelper } from './helper';
import { TaskService } from '../deploy/task/task.service';
import * as semver from 'semver';
import { PayloadUser } from '@app/common';
import { PROCESS_NODE } from '@devopsServer/utils/constants';

@ApiTags('迭代')
@Controller('iteration')
export class IterationController {
  constructor(
    private readonly iterationService: IterationService,
    private readonly processService: ProcessService,
    private readonly projectService: ProjectService,
    private readonly operationService: OperationService,
    private readonly branchService: BranchService,
    private readonly repositoryService: RepositoryService,
    private readonly iterationHelper: IterationHelper,
    private readonly processFlowService: ProcessFlowService,
    private readonly processNodeService: ProcessNodeService,
    private readonly taskService: TaskService,
  ) { }

  @ApiOperation({
    summary: '新建迭代',
    description:
      '成功创建`迭代`（Iteration）后，根据`项目类型`创建对应个数的`流程`（Process），更新项目信息的`最新迭代版本号`。',
  })
  @Post('create')
  // @RequirePermissions('iteration:create')
  async create(
    @Body() createIterationDto: CreateIterationDto,
    @PayloadUser() user: IPayloadUser,
  ) {
    const project: Project = await this.projectService.findProjectById(
      createIterationDto.projectId,
    );

    // 检查项目
    if (!project) {
      throw new BusinessException('项目不存在');
    }
    // 版本号大小校验
    if (
      project.lastIterationVersion &&
      semver.lte(createIterationDto.version, project.lastIterationVersion)
    ) {
      throw new BusinessException(
        `version: ${createIterationDto.version} ，请提供一个大于最新迭代版本号 ${project.lastIterationVersion} 的值`,
      );
    }

    const iteration: Iteration = {
      ...createIterationDto,
      creatorName: user.name,
      creatorId: user.userId,
      subProcessNodes: null,
      currentProcessNode: ProcessNodes.development, // 主流程设置为开发状态
      updateVersionType: createIterationDto.versionType,
    };

    // 记录应用与迭代的关联关系
    if (iteration.fplanId) {
      // 防止重复绑定
      const existLink = await this.iterationService.paginate(
        {
          fplanId: iteration.fplanId,
          projectId: project.id,
        },
        { pageSize: 1, currentPage: 1 },
      );
      if (existLink.items.length) {
        throw new BusinessException(`发布计划已关联该应用，请不要重复关联`);
      }
    }

    // 创建 迭代
    const savedIteration =
      await this.iterationService.createOrUpdate(iteration);

    // 保存操作记录
    await this.iterationHelper.record(project, savedIteration, user);

    // 该项目的类型列表
    const projectTypes = project.projectTypes;

    // 是否多分支管理
    const multiBranch = createIterationDto.multiBranch;

    const processes: Process[] = [];
    const branches: Branch[] = [];
    const processNodeMapping: { [projectType: string]: ProcessNodes } = {};

    const isHotfix =
      createIterationDto.versionType === updateVersionType.hotfix;

    for (const projectType of projectTypes) {
      // 使用对应项目类型的流程模板，并返回第一个环境节点
      const processTemplate = await this.processFlowService.findByName(
        isHotfix ? 'hotfix' : projectType,
      );

      if (!processTemplate) {
        throw new BusinessException('流程异常请联系管理员！');
      }

      const processNodeList = await this.processNodeService.findByIds(
        processTemplate.nodeIds,
      );

      const firstEnvNode: any = processNodeList[0] || PROCESS_NODE['web'][0];

      // 多分支管理的前缀
      const prefix = getBranchPrefix(projectType, multiBranch, projectTypes);

      // 创建的分支名, hotfix 分支
      const newBranch = `${prefix}${isHotfix ? 'hotfix' : firstEnvNode.type}/${createIterationDto.version
        }`;

      // 同步 git 分支
      this.iterationHelper.syncBranch(
        user,
        project,
        `${prefix}master`,
        newBranch,
      );

      // 不同项目类型的子流程
      const process: Process = {
        projectType,
        projectId: project.id,
        iterationId: savedIteration.id,
        currentProcessNode: firstEnvNode.env,
        currentEnvBranch: newBranch,
        updateVersionType: createIterationDto.versionType,
      };

      processNodeMapping[projectType] = process.currentProcessNode;

      processes.push(process);

      // 分支信息
      const recordBranch: Branch = {
        name: newBranch,
        projectId: project.id,
        iterationId: savedIteration.id,
        updateUserId: user.userId,
        creatorId: user.userId,
        gitBranchName: newBranch,
      };

      if (branches.findIndex((b) => b.name === recordBranch.name) === -1) {
        branches.push(recordBranch);
      }
    }
    // 更新迭代子流程的当前节点
    iteration.subProcessNodes = processNodeMapping;
    await this.iterationService.createOrUpdate(iteration);

    // 创建 流程
    await this.processService.createOrUpdate(processes);

    // 保存分支信息
    await this.branchService.createOrUpdate(branches);

    // 保存当前迭代版本号
    project.lastIterationVersion = createIterationDto.version;
    // 更新 项目信息
    await this.projectService.createOrUpdate(project);

    return savedIteration;
  }

  delBranch(project, iteration) {
    // 完结迭代，合并之后，删除分支
    try {
      this.repositoryService.delBranch({
        projectId: project.gitProjectId,
        branch: `dev/${iteration.version}`,
      });
      this.repositoryService.delBranch({
        projectId: project.gitProjectId,
        branch: `fix/${iteration.version}`,
      });
      this.repositoryService.delBranch({
        projectId: project.gitProjectId,
        branch: `test/${iteration.version}`,
      });
      this.repositoryService.delBranch({
        projectId: project.gitProjectId,
        branch: `prod/${iteration.version}`,
      });
      this.repositoryService.delBranch({
        projectId: project.gitProjectId,
        branch: `hotfix/${iteration.version}`,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @ApiOperation({
    summary: '完成迭代任务',
    description:
      '生产发布成功后，需要手动点击完成迭代，来合并分支到 master，并打上版本 tag',
  })
  @Post('completeIt')
  async completeIteration(
    @Body() completeIterationDto: CompleteIterationDto,
    @PayloadUser() user: IPayloadUser,
  ) {
    const iteration: Iteration = await this.iterationService.findIterationById(
      completeIterationDto.iterationId,
    );
    if (!iteration) {
      throw new BusinessException('未找到迭代');
    }
    // 至少有个子流程完成了生产部署
    if (iteration.currentProcessNode !== ProcessNodes.production_not_merge) {
      throw new BusinessException('当前迭代状态，不允许执行次操作');
    }

    const project: Project = await this.projectService.findProjectById(
      iteration.projectId,
    );

    if (!project) {
      throw new BusinessException('未找到项目');
    }

    const result = await this.repositoryService.autoMerge(
      {
        withTag: true,
        id: project.gitProjectId,
        title: `迭代为【${iteration.name}-${iteration.version}】的合并请求`,
        source_branch: `prod/${iteration.version}`,
        target_branch: 'master',
        tag_name: `v${iteration.version}`,
        tag_message: `迭代【${iteration.name}】已完成`,
      },
      user.gitAccessToken,
    );

    this.delBranch(project, iteration);

    // 标记 迭代当前流程 已完成
    iteration.currentProcessNode = ProcessNodes.completed;

    // 标记 迭代 已完成
    iteration.status = IterationStatus.done;
    await this.iterationService.createOrUpdate(iteration);

    return result;
  }

  @ApiOperation({
    summary: '提交申请',
  })
  @Post('updateStatus')
  async updateStatus(
    @Body() updateStatusDto: UpdateStatusDto,
    @PayloadUser() user: IPayloadUser,
  ) {
    const { iterationId, environment, projectType } = updateStatusDto;

    const iteration: Iteration =
      await this.iterationService.findIterationById(iterationId);

    if (!iteration) {
      throw new BusinessException('未找到迭代');
    }

    if (iteration.status === IterationStatus.deprecated) {
      throw new BusinessException(`迭代已废弃`);
    }

    const project: Project = await this.projectService.findProjectById(
      iteration.projectId,
    );

    // 多分支管理的前缀
    const prefix = getBranchPrefix(
      projectType,
      iteration.multiBranch,
      project.projectTypes,
    );

    let newBranch = `${prefix}dev/${iteration.version}`;

    switch (environment) {
      case ProcessNodes.apply_for_test: {
        iteration.testUser = user.name;
        newBranch = `${prefix}test/${iteration.version}`;

        // 记录 提交测试
        const record: ApplyForTesting = {
          iterationId: iteration.id,
        };
        this.operationService.createOrUpdate({
          operatorId: user.userId,
          operatorName: user.name,
          operationType: OperationType.apply_for_testing,
          record: JSON.stringify(record),
        });
        break;
      }
      case ProcessNodes.apply_for_fix: {
        iteration.preUser = user.name;
        newBranch = `${prefix}fix/${iteration.version}`;
        break;
      }
      case ProcessNodes.apply_for_production: {
        iteration.prodUser = user.name;
        newBranch = `${prefix}prod/${iteration.version}`;
        break;
      }
    }

    // 同步 git 分支
    this.iterationHelper.syncBranch(
      user,
      project,
      `${prefix}master`,
      newBranch,
    );

    const branch = await this.branchService.findBranchByName(
      newBranch,
      project.id,
    );

    const recordBranch: Branch = {
      name: newBranch,
      projectId: project.id,
      iterationId: iteration.id,
      updateUserId: user.userId,
      creatorId: user.userId,
      gitBranchName: newBranch,
    };

    //检查是否已存在分支
    if (branch) {
      // 更新
      await this.branchService.createOrUpdate({ ...branch, ...recordBranch });
    } else {
      // 创建
      await this.branchService.createOrUpdate(recordBranch);
    }

    const process: Process = {
      projectType,
      projectId: iteration.projectId,
      iterationId: iteration.id,
      currentProcessNode: environment,
      currentEnvBranch: newBranch,
    };

    if (!iteration.subProcessNodes) {
      iteration.subProcessNodes = {};
    }
    iteration.subProcessNodes[projectType] = environment;
    iteration.currentProcessNode = environment;

    // 更新流程
    await this.processService.createOrUpdate(process);
    // 更新迭代
    await this.iterationService.createOrUpdate(iteration);
  }

  @ApiOperation({
    summary: '迭代列表（分页）',
  })
  @Post('list/pagination')
  // @RequirePermissions('iterationlist:view')
  async listWithPagination(
    @Body() listWithPaginationDto: ListItWithPaginationDto,
  ): Promise<Pagination<Iteration, CustomPaginationMeta>> {
    const { page, ...searchCondition } = listWithPaginationDto;
    return await this.iterationService.paginate(searchCondition, page);
  }

  @ApiOperation({
    summary: '迭代详情',
  })
  @Post('detail')
  async detail(@Body() singleDto: { iterationId: number }): Promise<Iteration> {
    return await this.iterationService.findIterationById(singleDto.iterationId);
  }

  @ApiOperation({
    summary: '获取可用迭代',
    deprecated: true,
  })
  @Post('list/valid')
  async listWithValid(@Body() validIterationDto: ValidIterationDto) {
    return await this.iterationService.listWithValid(validIterationDto);
  }

  @ApiOperation({
    summary: '弃用迭代',
    description: '一旦弃用，就不再允许发布任何任务',
  })
  @Post('disableIt')
  async disableIt(@Body() disableIterationDto: DisableIterationDto) {
    const iteration = await this.iterationService.findIterationById(
      disableIterationDto.iterationId,
    );
    const project = await this.projectService.findProjectById(
      iteration.projectId,
    );

    this.delBranch(project, iteration);

    return await this.iterationService.changeIterationStatus(
      disableIterationDto.iterationId,
      IterationStatus.deprecated,
    );
  }

  @ApiOperation({
    summary: '迭代与发布计划解绑，并废弃',
  })
  @Post('disableActivePlanIt')
  async disableActivePlanIt(
    @Body()
    disableActivePlanItDto: DisableActivePlanItDto,
  ) {
    const iteration = await this.iterationService.findIterationByPlanId(
      disableActivePlanItDto.projectId,
      disableActivePlanItDto.fplanId,
    );

    if (!iteration) {
      throw new BusinessException('未找到迭代');
    }

    if (iteration.status === IterationStatus.done) {
      throw new BusinessException('已完成的应用版本不支持解绑发布计划');
    }

    if (iteration.status === IterationStatus.doing) {
      iteration.status = IterationStatus.deprecated;

      const project = await this.projectService.findProjectById(
        iteration.projectId,
      );

      this.delBranch(project, iteration);
    }

    await this.iterationService.createOrUpdate({
      ...iteration,
      fplanId: null,
    });
  }
}
