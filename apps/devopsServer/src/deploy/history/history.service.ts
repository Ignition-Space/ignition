import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DeployHistory } from './history.entity';
import { Task } from '../task/task.entity';

@Injectable()
export class DeployHistoryService {
  constructor(
    @Inject('DEPLOY_HISTORY_REPOSITORY')
    private deployHistoryRepository: Repository<DeployHistory>,
  ) { }

  async saveProduct({
    task,
    htmlAdr,
    iterationId,
    version,
  }: {
    task: Task;
    iterationId?: number;
    htmlAdr?: string;
    htmlStr?: string;
    version: string;
  }) {
    const deployHistory = await this.findOneByTaskId(task.id);
    await this.save({
      ...deployHistory,
      htmlAdr,
      projectId: task.projectId,
      iterationId,
      taskId: task.id,
      environment: task.env,
      projectType: task.projectType,
      version,
    });
  }

  save(deployConfig: Partial<DeployHistory>) {
    return this.deployHistoryRepository.save(deployConfig);
  }

  findOneByTaskId(taskId) {
    return this.deployHistoryRepository.findOne({
      where: {
        taskId,
      },
    });
  }

  getHistoryLatest(searchHistoryDto: Partial<DeployHistory>) {
    console.log(searchHistoryDto);
    return this.deployHistoryRepository.findOne({
      where: {
        ...searchHistoryDto,
      },
      order: {
        id: 'DESC',
      },
    });
  }
}
