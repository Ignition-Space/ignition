import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { isNotEmpty } from 'class-validator';
import { ThirdMiniProgramConfig } from './third-mini-program-config.entity';

@Injectable()
export class ThirdMiniProgramConfigService {
  constructor(
    @Inject('THIRD_MINI_PROGRAM_CONFIG_REPOSITORY')
    private readonly thirdMiniProgramConfigRepository: Repository<ThirdMiniProgramConfig>,
  ) { }

  createOrUpdate(thirdMiniProgramConfig) {
    return this.thirdMiniProgramConfigRepository.save(thirdMiniProgramConfig);
  }

  findOne(id) {
    return this.thirdMiniProgramConfigRepository.findOne(id);
  }

  findByProjectId(searchParams) {
    const queryBuilder =
      this.thirdMiniProgramConfigRepository.createQueryBuilder(
        'third_mini_program_config',
      );

    if (isNotEmpty(searchParams.projectId)) {
      queryBuilder.andWhere('third_mini_program_config.project_id LIKE :name', {
        name: `%${searchParams.projectId}%`,
      });
    }
    return queryBuilder.getMany();
  }
}
