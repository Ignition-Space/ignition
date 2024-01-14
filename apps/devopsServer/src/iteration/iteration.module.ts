import { forwardRef, Module } from '@nestjs/common';
import { BranchModule } from '../branch/branch.module';
import { ProcessModule } from '../iteration/process/process.module';
import { ProjectModule } from '../project/project.module';
import { DatabaseModule } from '@app/common';
import { RepositoryModule } from '../common/repository/repository.module';

import { IterationController } from './iteration.controller';
import { IterationService } from './iteration.service';
import { IterationConstraint } from './iteration.validator';
import { OperationModule } from '../system/operation/operation.module';
import { IterationHelper } from './helper';
import { TaskModule } from '../deploy/task/task.module';
import { Iteration } from './iteration.entity';

@Module({
  controllers: [IterationController],
  providers: [
    {
      provide: 'ITERATION_REPOSITORY',
      useFactory: (AppDataSource) => AppDataSource.getRepository(Iteration),
      inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
    },
    IterationService,
    IterationConstraint,
    IterationHelper,
  ],
  imports: [
    DatabaseModule,
    OperationModule,
    forwardRef(() => ProjectModule),
    forwardRef(() => ProcessModule),
    forwardRef(() => TaskModule),
    BranchModule,
    RepositoryModule,
  ],
  exports: [IterationService],
})
export class IterationModule { }
