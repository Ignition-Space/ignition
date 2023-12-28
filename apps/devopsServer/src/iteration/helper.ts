import { Injectable } from '@nestjs/common';
import { BranchService } from '@devopsServer/branch/branch.service';
import {
  CreateIterationRecord,
  Operation,
  OperationType,
} from '@devopsServer/system/operation/operation.entity';
import { OperationService } from '@devopsServer/system/operation/operation.service';
import { ProcessService } from '@devopsServer/iteration/process/process.service';
import { Project } from '@devopsServer/project/project.entity';
import { ProjectService } from '@devopsServer/project/project.service';
import { RepositoryService } from '@devopsServer/common/repository/repository.service';
import { Iteration } from './iteration.entity';
import { IterationService } from './iteration.service';

const otherMasterBranches = ['rn/master'];

@Injectable()
export class IterationHelper {
  constructor(
    private readonly iterationService: IterationService,
    private readonly processService: ProcessService,
    private readonly projectService: ProjectService,
    private readonly operationService: OperationService,
    private readonly branchService: BranchService,
    private readonly repositoryService: RepositoryService,
  ) { }

  // 同步 git 分支
  async syncBranch(
    user: IPayloadUser,
    project: Project,
    refBranch: string,
    newBranch: string,
  ) {
    const branch = await this.branchService.findBranchByName(
      newBranch,
      project.id,
    );
    // 检查数据库分支
    if (branch) {
      console.log('Git 已存在当前分支，将直接关联');
      return;
    }

    // 多分支管理情况，如果没有对应项目类型的主分支，创建主分支。
    if (otherMasterBranches.includes(refBranch)) {
      const b = await this.repositoryService.getSingleBranch(
        {
          ref: 'master',
          projectId: project.gitProjectId,
          branch: refBranch,
        },
        user.gitAccessToken,
      );
      if (!b) {
        await this.repositoryService.createBranch(
          {
            ref: 'master',
            projectId: project.gitProjectId,
            branch: refBranch,
          },
          user.gitAccessToken,
        );
      }
    }

    // 检查 gitlab 仓库是否包含该分支，如果没有则创建。
    const gitBranch = await this.repositoryService.getSingleBranch(
      {
        ref: refBranch,
        projectId: project.gitProjectId,
        branch: newBranch,
      },
      user.gitAccessToken,
    );
    if (!gitBranch) {
      await this.repositoryService.createBranch(
        {
          ref: refBranch,
          projectId: project.gitProjectId,
          branch: newBranch,
        },
        user.gitAccessToken,
      );
    }
  }

  async record(
    project: Project,
    savedIteration: Iteration,
    user: IPayloadUser,
  ) {
    const record: CreateIterationRecord = {
      projectId: project.id,
      iterationId: savedIteration.id,
      iterationName: savedIteration.name,
    };
    const operation: Operation = {
      operationType: OperationType.create_iteration,
      operatorId: user.userId,
      operatorName: user.name,
      record: JSON.stringify(record),
    };
    await this.operationService.createOrUpdate(operation);
  }
}
