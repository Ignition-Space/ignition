/*
 * @Author: Cookie
 * @Description:
 */

import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeployHistoryService } from './history.service';
import { BusinessException, Public } from '@app/common';
import { SaveProductDto, SearchHistoryDto } from './history.dto';
import { ProjectService } from '@devopsServer/project/project.service';
import { IterationService } from '@devopsServer/iteration/iteration.service';
import { ProcessNodes } from '@devopsServer/iteration/process/process.entity';
import { TaskService } from '../task/task.service';
import { pick } from 'lodash';

@ApiTags('历史发布版本（记录制品）')
@Controller('deployHistory')
export class DeployHistoryController {
  constructor(
    private deployHistoryService: DeployHistoryService,
    private projectService: ProjectService,
    private iterationService: IterationService,
    private taskService: TaskService,
  ) { }

  @Post('getMicroHistoryLatest')
  async getMicroHistoryLatest(@Body() searchHistoryDto: SearchHistoryDto) {
    let history = await this.deployHistoryService.getHistoryLatest(
      pick(searchHistoryDto, 'projectId', 'environment'),
    );

    let environment: ProcessNodes = ProcessNodes.development;

    if (searchHistoryDto.environment === ProcessNodes.development) {
      environment = ProcessNodes.production;
    }

    if (searchHistoryDto.environment === ProcessNodes.testing) {
      environment = ProcessNodes.development;
    }

    if (searchHistoryDto.environment === ProcessNodes.fix) {
      environment = ProcessNodes.testing;
    }

    console.log(history);

    if (!history) {
      history = await this.deployHistoryService.getHistoryLatest({
        projectId: searchHistoryDto.projectId,
        environment,
      });
    }

    if (!history) return null;

    const microVersion = [];

    /**
     * TODO refactor 移除 microVersion 仅保留 microConfig
     * 获取对应发布计划或者迭代的版本号
     */
    if (history.microConfig) {
      for (const { projectId, iterationId } of history.microConfig) {
        const childProject =
          await this.projectService.findProjectById(projectId);
        const childIteration =
          await this.iterationService.findIterationById(iterationId);
        microVersion.push({
          ...childProject,
          ...childIteration,
          version: childIteration.version,
          iterationId: childIteration.id,
          projectId: childProject.id,
        });
      }
    }

    return {
      ...history,
      microVersion,
    };
  }

  @Post('saveProduct')
  @Public()
  async saveProduct(@Body() saveProductDto: SaveProductDto) {
    const task = await this.taskService.findById(saveProductDto.taskId);
    if (!task) {
      throw new BusinessException('任务不存在');
    }
    let version: string;
    let iterationId: number;
    const iteration = await this.iterationService.findIterationById(
      task.iterationId,
    );
    if (!iteration) {
      throw new BusinessException('任务信息缺失');
      version = iteration.version;
      iterationId = iteration.id;
    }

    await this.deployHistoryService.saveProduct({
      task,
      htmlAdr: saveProductDto.htmlAdr,
      iterationId,
      version,
    });
  }
}
