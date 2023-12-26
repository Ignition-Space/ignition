import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Project } from '@devopsServer/project/project.entity';
import { PublishStatus, Task } from '@devopsServer/deploy/task/task.entity';
import { ListDto } from './process.dto';
import { ProcessNodes } from './process.entity';
import { PROCESS_NODE, Template } from '@devopsServer/utils/constants';
import { ProcessService } from './process.service';
import { ProjectService } from '@devopsServer/project/project.service';
import { ProcessFlowService } from './processFlow/processFlow.service';
import { ProcessNodeService } from './processNode/processNode.service';
import { ProcessNode } from './processNode/processNode.entity';
import {
  Iteration,
  updateVersionType,
} from '@devopsServer/iteration/iteration.entity';
import { versionMap, versionTypeMap } from '@devopsServer/deploy/task/task.dto';
import { IterationService } from '@devopsServer/iteration/iteration.service';
import { keyBy } from 'lodash';

type ProcessTask = {
  [key in Template['env']]?: Partial<Task>[];
};

type Result = {
  [projectType: string]: ProcessTask & { currentProcessNode?: number };
};

@ApiTags('流程')
@Controller('process')
export class ProcessController {
  constructor(
    private readonly processService: ProcessService,
    private readonly projectService: ProjectService,
    private readonly processFlowService: ProcessFlowService,
    private readonly processNodeService: ProcessNodeService,
    private readonly iterationService: IterationService,
  ) { }

  @Post('list')
  async list(@Body() listDto: ListDto) {
    // 获取该项目的流程列表
    const processList = await this.processService.list(listDto);

    if (processList.length === 0) {
      return [];
    }

    // 项目
    const project: Project = await this.projectService.findProjectById(
      listDto.projectId,
    );

    const resultList = [];
    const result: Result = {};

    // 当前项目类型列表
    const projectTypes = project.projectTypes;

    projectTypes.forEach((type) => {
      result[type] = {};
    });

    // 遍历流程列表
    for (const process of processList) {
      // 如果存在用户修改了项目类型，那么以项目类型为准，不包含在当前项目类型的 process 作忽略处理。
      if (projectTypes.includes(process.projectType)) {
        let processCurrentEnv = process.currentProcessNode;
        const isHotfix = process.updateVersionType === updateVersionType.hotfix;
        const processProjectType = process.projectType;

        const processTemplate = await this.processFlowService.findByName(
          isHotfix ? 'hotfix' : processProjectType,
        );

        const processNodeList = await this.processNodeService.findByIds(
          processTemplate.nodeIds,
        );

        switch (process.currentProcessNode) {
          case ProcessNodes.apply_for_test: {
            processCurrentEnv = ProcessNodes.testing;
            break;
          }
          case ProcessNodes.apply_for_fix: {
            processCurrentEnv = ProcessNodes.fix;
            break;
          }
          case ProcessNodes.apply_for_production: {
            processCurrentEnv = ProcessNodes.production;
            break;
          }
        }

        // 遍历 模板的节点，获取每个节点的 task 并按照 env 分组
        for (const processNode of processNodeList) {
          const { env, type } = processNode;
          // processNodeList.forEach(({ env, type }: ProcessNode) => {

          const taskName = `${type}CurrentTask`;
          const task = process[taskName];
          const published = task !== null;

          if (!result[processProjectType][env])
            result[processProjectType][env] = [];
          // 模板当前环境节点是否发布过
          if (published) {
            if (process.projectType === 'npm') {
              const iteration = await this.iterationService.findIterationById(
                process.iterationId,
              );
              result[processProjectType][env].unshift({
                ...task,
                npmVersion: `${iteration.version}-${versionTypeMap[env]}.${iteration[versionMap[env]]
                  }`,
              });
            } else {
              result[processProjectType][env].unshift({
                ...task,
              });
            }
          } else {
            // 如果模板和当前 process env 一样，手动设置一个空 task
            if (env === processCurrentEnv) {
              result[processProjectType][env].unshift({
                status: PublishStatus.unpublished,
                branch: process.currentEnvBranch,
              });
            }
          }
        }

        // 单端当前流程节点设置较大者
        result[processProjectType].currentProcessNode = Math.max(
          Number(processCurrentEnv),
          Number(result[processProjectType].currentProcessNode) ||
          ProcessNodes.development,
        );
      }
    }

    // map 转 数组
    Object.keys(result).forEach((projectType) => {
      const { currentProcessNode, ...processTask } = result[projectType];
      const nodeEnvs = Object.keys(processTask);
      const processList = nodeEnvs.map((t) => {
        return {
          status: t,
          taskList: processTask[t],
        };
      });
      if (processList.length > 0) {
        resultList.push({
          stepIndex: nodeEnvs.indexOf(String(currentProcessNode)),
          type: projectType,
          currentProcessNode,
          processList,
        });
      }
    });

    return resultList;
  }
}
