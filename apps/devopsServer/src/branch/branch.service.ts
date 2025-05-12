import { Inject, Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Branch } from './branch.mongo.entity';

@Injectable()
export class BranchService {
  constructor(
    @Inject('BRANCH_REPOSITORY')
    private branchRepository: MongoRepository<Branch>,
  ) { }

  createOrUpdate(branch) {
    return this.branchRepository.save(branch);
  }

  findBranchByName(name: string, projectId: string) {
    return this.branchRepository.findOne({
      where: {
        name,
        projectId,
      },
    });
  }
}
