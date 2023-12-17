import { forwardRef, Module } from '@nestjs/common';
import { BranchModule } from '../branch/branch.module';
import { ProcessModule } from '../iteration/process/process.module';
import { ProjectModule } from '../project/project.module';
import { DatabaseModule } from '@app/common';
import { RepositoryModule } from '../common/repository/repository.module';

import { IterationController } from './iteration.controller';
import { iterationProviders } from './iteration.providers';
import { IterationService } from './iteration.service';
import { IterationConstraint } from './iteration.validator';
import { OperationModule } from '../system/operation/operation.module';
import { IterationHelper } from './helper';
import { TaskModule } from '../deploy/task/task.module';

@Module({
  controllers: [IterationController],
  providers: [
    ...iterationProviders,
    IterationService,
    IterationConstraint,
    IterationHelper,
  ],
  imports: [
    DatabaseModule,
    OperationModule,
    forwardRef(() => ProjectModule),
    forwardRef(() => ProcessModule),
    forwardRef(() => UserModule),
    forwardRef(() => FeishuModule),
    forwardRef(() => TaskModule),
    BranchModule,
    RepositoryModule,
    OpsReleasePlanLinkModule,
    EnvsLockModule,
    OpsReleasePlanModule,
  ],
  exports: [IterationService],
})
export class IterationModule { }
