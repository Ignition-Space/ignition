import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { branchProviders } from './branch.providers';
import { BranchService } from './branch.service';

@Module({
  providers: [...branchProviders, BranchService],
  imports: [DatabaseModule],
  exports: [BranchService],
})
export class BranchModule { }
