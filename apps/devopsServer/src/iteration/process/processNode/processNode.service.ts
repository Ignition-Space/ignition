import { Inject, Injectable } from '@nestjs/common';
import { IterationService } from '@devopsServer/iteration/iteration.service';
import { TaskService } from '@devopsServer/deploy/task/task.service';
import { Repository, In } from 'typeorm';
import { ProcessNode } from './processNode.entity';

@Injectable()
export class ProcessNodeService {
  constructor(
    @Inject('PROCESS_NODE_REPOSITORY')
    private readonly processNodeRepository: Repository<ProcessNode>,
    private readonly iterationService: IterationService,
    private readonly taskService: TaskService,
  ) { }

  createOrUpdate(processNode) {
    return this.processNodeRepository.save(processNode);
  }

  findById(id) {
    return this.processNodeRepository.findOne(id);
  }

  findByEnv(env) {
    return this.processNodeRepository.findOne({
      where: {
        env,
      },
    });
  }

  findByIds(ids) {
    return this.processNodeRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  findByAll() {
    return this.processNodeRepository.find();
  }
}
