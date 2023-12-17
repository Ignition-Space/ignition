import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ThirdMiniProgramTask } from './third-mini-program-task.entity';

@Injectable()
export class ThirdMiniProgramTaskService {
  constructor(
    @Inject('THIRD_MINI_PROGRAM_TASK_REPOSITORY')
    private readonly thirdMiniProgramTask: Repository<ThirdMiniProgramTask>,
  ) { }

  createOrUpdate(ThirdMiniProgramTask) {
    return this.thirdMiniProgramTask.save(ThirdMiniProgramTask);
  }

  getList(searchDto) {
    return this.thirdMiniProgramTask.find(...searchDto);
  }
}
