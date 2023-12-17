import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { ThirdMiniProgram } from './third-mini-program.entity';
@Injectable()
export class ThirdMiniProgramService {
  constructor(
    @Inject('THIRD_MINI_PROGRAM_REPOSITORY')
    private readonly thirdMiniProgramRepository: Repository<ThirdMiniProgram>,
  ) { }

  findOne(params) {
    return this.thirdMiniProgramRepository.findOne({
      where: {
        ...params,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findByIds(ids: number[], projectId, environment: number) {
    const res: ThirdMiniProgram[] = await this.thirdMiniProgramRepository.find({
      where: {
        id: In(ids),
      },
    });
    return res.filter(
      (r) => r.projectId === projectId && r.environment == environment,
    );
  }

  createOrUpdate(thirdMiniProgram) {
    return this.thirdMiniProgramRepository.save(thirdMiniProgram);
  }

  findByProjectId({ projectId, environment }) {
    return this.thirdMiniProgramRepository.find({
      where: {
        projectId,
        environment,
      },
    });
  }
}
