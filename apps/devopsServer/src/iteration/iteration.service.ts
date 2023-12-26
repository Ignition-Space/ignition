import { Inject, Injectable } from '@nestjs/common';
import { In, Raw, Repository } from 'typeorm';
import { Iteration, IterationStatus } from './iteration.entity';

import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { getPaginationOptions } from '@app/common';
import { ListDto, SearchConditionDto } from './iteration.dto';
import { isEmpty } from 'class-validator';
import { getOperatorByTime } from '@devopsServer/utils/operators';
import { ProcessNodes } from './process/process.entity';

@Injectable()
export class IterationService {
  constructor(
    @Inject('ITERATION_REPOSITORY')
    private readonly iterationRepository: Repository<Iteration>,
  ) { }

  createOrUpdate(iteration: Iteration): Promise<Iteration> {
    return this.iterationRepository.save(iteration);
  }

  findIterationById(id: number) {
    return this.iterationRepository.findOne({
      where: {
        id,
      },
    });
  }

  findIterationByProcess(projectId: number, currentProcessNode: ProcessNodes) {
    return this.iterationRepository.findOne({
      where: {
        projectId,
        currentProcessNode,
        status: IterationStatus.doing,
      },
    });
  }

  findIterationByPlanId(projectId: number, fplanId: number) {
    return this.iterationRepository.findOne({
      where: {
        projectId,
        fplanId,
      },
    });
  }

  findByFeishuApprovalInstanceCode(code: string) {
    return this.iterationRepository.findOne({
      where: {
        feishuApprovalInstanceCode: code,
      },
    });
  }

  findIterationByVersion(projectId: number, version: string) {
    return this.iterationRepository.findOne({
      where: {
        projectId,
        version,
      },
    });
  }

  changeIterationStatus(iterationId: number, status: IterationStatus) {
    return this.iterationRepository.update(iterationId, { status: status });
  }

  list({ projectId, status, startTime, endTime, fplanId }: ListDto) {
    return this.iterationRepository.find({
      where: {
        createTime: getOperatorByTime(startTime, endTime),
        projectId: isEmpty(projectId) ? Raw(() => '1=1') : projectId,
        status: status.length > 0 ? In(status) : Raw(() => '1=1'),
        fplanId: typeof fplanId === 'undefined' ? Raw(() => '1=1') : fplanId,
      },
      take: 100,
    });
  }

  listWithValid({ projectId, status }) {
    return this.iterationRepository.find({
      where: {
        projectId,
        status: In(status),
      },
      order: {
        id: 'DESC',
      },
    });
  }

  paginate(
    searchCondition: SearchConditionDto,
    page: PaginationParams,
  ): Promise<Pagination<Iteration, CustomPaginationMeta>> {
    const queryBuilder =
      this.iterationRepository.createQueryBuilder('iteration');
    queryBuilder.orderBy('iteration.createTime', 'DESC');

    if (typeof searchCondition.projectId !== 'undefined') {
      queryBuilder.where('iteration.project_id = :id', {
        id: searchCondition.projectId,
      });
    }

    if (typeof searchCondition.fplanId !== 'undefined') {
      queryBuilder.andWhere('iteration.fplan_id = :fplanId', {
        fplanId: searchCondition.fplanId,
      });
    }

    if (typeof searchCondition.status !== 'undefined') {
      queryBuilder.andWhere(`iteration.status = :status`, {
        status: searchCondition.status,
      });
    }

    return paginate<Iteration, CustomPaginationMeta>(
      queryBuilder,
      getPaginationOptions(page),
    );
  }
}
