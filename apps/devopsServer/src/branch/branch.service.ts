import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Branch } from './branch.entity';

@Injectable()
export class BranchService {
  constructor(
    @Inject('BRANCH_REPOSITORY')
    private branchRepository: Repository<Branch>,
  ) { }

  createOrUpdate(branch) {
    return this.branchRepository.save(branch);
  }

  findBranchByName(name: string, projectId: number) {
    return this.branchRepository.findOne({
      where: {
        name,
        projectId,
      },
    });
  }
}
