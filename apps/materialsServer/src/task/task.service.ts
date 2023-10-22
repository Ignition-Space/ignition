import { Inject, Injectable } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { getPaginationOptions } from '@app/common';
import { In, MongoRepository, ObjectId } from 'typeorm';
import { SearchConditionDto } from './task.dto';
import { Task } from './task.mongo.entity';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_REPOSITORY')
    private taskRepository: MongoRepository<Task>,
  ) { }

  save(task: Task): Promise<Task> {
    return this.taskRepository.save(task);
  }

  updateById(id, task: Task) {
    return this.taskRepository.findOneAndUpdate(
      { "_id": new ObjectId(id) },
      { $set: { ...task } },
      { upsert: true }
    )
  }

  findById(id) {
    return this.taskRepository.findOne(id);
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

}
