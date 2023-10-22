/**
 * @description: 任务
 */

import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PayloadUser } from '@app/common';

import { TaskService } from './task.service';
import { PublishStatus, Task } from './task.mongo.entity';

import {
  ListWithPaginationDto,
  UpdateTaskDto,
} from './task.dto';

import { Public } from '@app/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import {
  ProcessMap, versionMap,
  staticMap, ProcessNodes
} from '../material/physical/physical.dto';

import { ProjectService } from '../project/project.service';
import { PhysicalMaterialService } from '../material/physical/physical.service';
import { MaterialConfigService } from '../material/config/materialConfig.service';
import { MonorepoGroupService } from '../group/monorepo/monorepoGroup.service';

@ApiTags('任务')
@Controller('task')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private materialService: PhysicalMaterialService,
    private projectService: ProjectService,
    private materialConfigService: MaterialConfigService,
    private monorepoGroupService: MonorepoGroupService
  ) { }

  @Post('updateTaskStatus')
  @Public()
  async updateTask(
    @Body() updateTaskDto: UpdateTaskDto,
    @PayloadUser() user: Payload,
  ) {
    const { id, status = PublishStatus.unpublished, buildId } = updateTaskDto;
    const task: Task = await this.taskService.findById(id);
    const numberedStatus = Number(status);
    const { id: taskId, ...restTask } = task
    let material: any = {}

    if (task.materialId) {
      material = await this.materialService.findOne(task.materialId)
    }

    if (task.groupId) {
      material = await this.monorepoGroupService.findOne(task.groupId)
    }

    const project = await this.projectService.findOne({ id: material.projectId })

    if (numberedStatus === PublishStatus.publish_success) {

      const updateConfig: any = {
        version: task.deployVersion,
        env: task.env,
      }

      if (project.projectTypes.indexOf('cdn') > -1) {
        updateConfig.cdn = `${staticMap[task.env]}/@xy/${project.enName}/${task.deployVersion}/static`
      }

      const config = await this.materialConfigService.save(updateConfig)
      const changeEev = ProcessMap[task.env]

      const materialUpdate: any = {
        [changeEev]: String(config.id),
        currentVersion: task.version,
        lastVersion: task.env === ProcessNodes.production ? task.deployVersion : material.lastVersion
      }

      versionMap[task.env] && (materialUpdate[versionMap[task.env]] = task.deployNum)

      if (task.env === ProcessNodes.production) {
        materialUpdate.alphaVersion = 1
        materialUpdate.betaVersion = 1
        materialUpdate.gammaVersion = 1
      }

      if (task.materialId) {
        this.materialService.updateOne(task.materialId, materialUpdate)
      }

      if (task.groupId) {
        this.monorepoGroupService.updateOne(task.groupId, materialUpdate)
      }
    }

    const updatedTask = { ...restTask, buildId };
    numberedStatus && (updatedTask.status = numberedStatus);
    updatedTask.endTime = new Date().toLocaleTimeString();
    this.taskService.updateById(taskId, updatedTask);

  }

  @ApiOperation({
    summary: '获取task详情',
  })
  @Post('detail')
  async getSingle(@Body() singleDto: { taskId: number }): Promise<Task> {
    const { taskId } = singleDto;
    return await this.taskService.findById(taskId);
  }

  @ApiOperation({
    summary: '任务列表（分页）',
  })
  @Post('list/pagination')
  async listWithPagination(
    @Body() listWithPaginationDto: ListWithPaginationDto,
  ): Promise<Pagination<Task, CustomPaginationMeta>> {
    const { page, ...searchCondition } = listWithPaginationDto;
    return await this.taskService.paginate(searchCondition, page);
  }

  @ApiOperation({
    summary: '回滚',
  })
  @Post('rollback')
  rollback() {
    return null;
  }

}
