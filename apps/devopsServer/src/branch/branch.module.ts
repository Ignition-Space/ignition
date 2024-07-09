import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { BranchService } from './branch.service';
import { Branch } from './branch.entity';

@Module({
  providers: [
    {
      provide: 'BRANCH_REPOSITORY',
      useFactory: (AppDataSource) => AppDataSource.getRepository(Branch),
      inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
    },
    BranchService,
  ],
  imports: [DatabaseModule],
  exports: [BranchService],
})
export class BranchModule { }
