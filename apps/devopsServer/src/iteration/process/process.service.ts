import { Inject, Injectable } from '@nestjs/common';
import { isArray, isEmpty, isNotEmpty } from 'class-validator';
import { Iteration } from '@devopsServer/iteration/iteration.entity';
import { IterationService } from '@devopsServer/iteration/iteration.service';
import { Task } from '@devopsServer/deploy/task/task.entity';
import { TaskService } from '@devopsServer/deploy/task/task.service';
import { getIOS8601Time } from '@devopsServer/utils/helper';
import { In, Raw, Repository } from 'typeorm';
import { ListDto, ListResponseDto } from './process.dto';
import { Process } from './process.entity';

@Injectable()
export class ProcessService {
  constructor(
    @Inject('PROCESS_REPOSITORY')
    private readonly processRepository: Repository<Process>,
    private readonly iterationService: IterationService,
    private readonly taskService: TaskService,
  ) { }

  createOrUpdate(process) {
    return this.processRepository.save(process);
  }

  findProcess({
    iterationId,
    projectId,
    projectType,
  }: {
    iterationId: number;
    projectId: number;
    projectType: string;
  }) {
    return this.processRepository.findOne({
      where: {
        iterationId,
        projectId,
        projectType,
      },
    });
  }

  async list({ projectId, status, fplanId }: ListDto) {
    // 未提供 status 直接查询所有流程
    if (typeof status === 'undefined') {
      return await polymerizeTasks(
        this.taskService,
        await this.processRepository.find({ where: { projectId }, take: 100 }),
      );
    }

    if (isEmpty(status) || !isArray(status)) {
      status = [];
    }
    // 根据 status 查找迭代。
    const iterations: Iteration[] = await this.iterationService.list({
      projectId,
      fplanId,
      status,
    });

    const iterationIds = iterations.map((it) => it.id);

    const processes = await this.processRepository.find({
      where: {
        projectId,
        iterationId:
          iterationIds.length > 0 ? In(iterationIds) : Raw(() => '0=1'),
      },
      take: 100,
    });

    // 获取流程
    return await polymerizeTasks(this.taskService, processes);
  }
}
// 聚合 task 数据
const polymerizeTasks = async (
  taskService: TaskService,
  processes: Process[],
) => {
  if (processes.length === 0) {
    return [];
  }

  const taskIds: Set<number> = new Set();

  processes.forEach((p) => {
    isNotEmpty(p.devCurrentTaskId) && taskIds.add(p.devCurrentTaskId);
    isNotEmpty(p.testCurrentTaskId) && taskIds.add(p.testCurrentTaskId);
    isNotEmpty(p.fixCurrentTaskId) && taskIds.add(p.fixCurrentTaskId);
    isNotEmpty(p.prodCurrentTaskId) && taskIds.add(p.prodCurrentTaskId);
  });

  const tasks = await taskService.listByIds(Array.from(taskIds), [
    'branch',
    'creatorId',
    'creatorName',
    'startTime',
    'id',
    'status',
    'endTime',
  ]);

  const taskMapping = tasks.reduce((result, t) => {
    result[t.id] = t;
    t['currentTime'] = getIOS8601Time();
    return result;
  }, {});

  const polymerizedProcess: ListResponseDto[] = processes.map((p) => {
    const item: ListResponseDto = {
      ...p,
      devCurrentTask: null,
      testCurrentTask: null,
      fixCurrentTask: null,
      prodCurrentTask: null,
    };

    isNotEmpty(p.devCurrentTaskId) &&
      (item.devCurrentTask = taskMapping[p.devCurrentTaskId]);
    isNotEmpty(p.testCurrentTaskId) &&
      (item.testCurrentTask = taskMapping[p.testCurrentTaskId]);
    isNotEmpty(p.fixCurrentTaskId) &&
      (item.fixCurrentTask = taskMapping[p.fixCurrentTaskId]);
    isNotEmpty(p.prodCurrentTaskId) &&
      (item.prodCurrentTask = taskMapping[p.prodCurrentTaskId]);
    return item;
  });

  return polymerizedProcess;
};
