import { Inject, Injectable } from '@nestjs/common';
import { isArray, isEmpty, isNotEmpty } from 'class-validator';
import { Iteration } from '@devopsServer/iteration/iteration.entity';
import { IterationService } from '@devopsServer/iteration/iteration.service';
import { Task } from '@devopsServer/deploy/task/task.entity';
import { TaskService } from '@devopsServer/deploy/task/task.service';
import { getIOS8601Time } from '@devopsServer/utils/helper';
import { In, Raw, Repository } from 'typeorm';
import { ProcessFlow } from './processFlow.entity';
import { ProcessNodeService } from '../processNode/processNode.service';

@Injectable()
export class ProcessFlowService {
  constructor(
    @Inject('PROCESS_FLOW_REPOSITORY')
    private readonly processFlowRepository: Repository<ProcessFlow>,
  ) { }

  createOrUpdate(processFlow) {
    return this.processFlowRepository.save(processFlow);
  }

  findById(id) {
    return this.processFlowRepository.findOne(id);
  }

  findByName(name) {
    return this.processFlowRepository.findOne({
      where: {
        name,
      },
    });
  }

  findByIds(ids) {
    return this.processFlowRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  findByAll() {
    return this.processFlowRepository.find();
  }
}
