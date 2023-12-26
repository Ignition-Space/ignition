import { Inject, Injectable } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { getPaginationOptions, CustomPaginationMeta } from '@app/common';
import { In, Repository, Not } from 'typeorm';
import { SearchConditionDto } from './task.dto';
import { Task, PublishStatus } from './task.entity';
import { ProcessNodes } from '@devopsServer/iteration/process/process.entity';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_REPOSITORY')
    private taskRepository: Repository<Task>,
  ) { }

  publish(task: Task): Promise<Task> {
    return this.taskRepository.save(task);
  }

  updateById(id: number, task: Task) {
    this.taskRepository.update({ id }, task);
  }

  findById(id: number) {
    return this.taskRepository.findOne({
      where: {
        id,
      },
    });
  }

  listByIds(ids: number[], select: (keyof Task)[]) {
    return this.taskRepository.find({
      where: { id: In(ids) },
      select,
    });
  }

  paginate(
    searchCondition: SearchConditionDto,
    page: PaginationParams,
  ): Promise<Pagination<Task, CustomPaginationMeta>> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    queryBuilder.select([
      'task.id',
      'task.branch',
      'task.env',
      'task.creatorId',
      'task.creatorName',
      'task.status',
      'task.startTime',
      'task.projectType',
    ]);

    if (typeof searchCondition.projectId !== 'undefined') {
      queryBuilder.where('task.projectId = :id', {
        id: searchCondition.projectId,
      });
    }

    if (typeof searchCondition.iterationId !== 'undefined') {
      queryBuilder.andWhere('task.iterationId = :id', {
        id: searchCondition.iterationId,
      });
    }

    if (typeof searchCondition.processId !== 'undefined') {
      queryBuilder.andWhere('task.processId = :id', {
        id: searchCondition.processId,
      });
    }

    if (typeof searchCondition.status !== 'undefined') {
      queryBuilder.andWhere(`task.status = :status`, {
        status: searchCondition.status,
      });
    }

    queryBuilder.orderBy('start_time', 'DESC');

    return paginate<Task, CustomPaginationMeta>(
      queryBuilder,
      getPaginationOptions(page),
    );
  }

  async checkTaskExist({
    projectId,
    planLinkIdList,
    iterationIdList,
    environment,
  }: {
    projectId: number;
    planLinkIdList?: string[];
    iterationIdList?: number[];
    environment: ProcessNodes;
  }) {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    queryBuilder.select('task.id', 'id');
    queryBuilder.addSelect('task.iterationId', 'iterationId');
    queryBuilder.where({
      env: environment,
      projectId,
      status: PublishStatus.publish_success,
    });
    const iterationQuery = [];
    if (iterationIdList?.length)
      iterationQuery.push({ iterationId: In(iterationIdList) });
    if (iterationQuery.length) {
      queryBuilder.andWhere(iterationQuery);
    }
    queryBuilder.groupBy('iteration_id,plan_link_id');
    return await queryBuilder.execute();
  }

  async getAppLatestTaskOnEnv(
    {
      projectId,
      env,
    }: {
      projectId: number;
      env: number;
    },
    excludeIds: number[],
  ) {
    return this.taskRepository.findOne({
      where: {
        projectId,
        env,
        id: Not(In(excludeIds)),
      },
      order: {
        id: 'DESC',
      },
    });
  }
}
