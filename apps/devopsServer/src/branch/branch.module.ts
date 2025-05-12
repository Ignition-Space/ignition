import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { BranchService } from './branch.service';
import { Branch } from './branch.mongo.entity';

@Module({
  providers: [
    {
      provide: 'BRANCH_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(Branch),
      inject: ['MONGODB_DATA_SOURCE'],
    },
    BranchService,
  ],
  imports: [DatabaseModule],
  exports: [BranchService],
})
export class BranchModule { }
