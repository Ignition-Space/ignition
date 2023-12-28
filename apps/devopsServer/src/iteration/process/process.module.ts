import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { processProviders } from './process.providers';
import { ProcessService } from './process.service';
import { ProjectModule } from '@devopsServer/project/project.module';
import { ProcessConstraint } from './process.validator';
import { ProcessController } from './process.controller';
import { IterationModule } from '@devopsServer/iteration/iteration.module';
import { TaskModule } from '@devopsServer/deploy/task/task.module';

import { ProcessNodeController } from './processNode/processNode.controller';
import { ProcessNodeService } from './processNode/processNode.service';

import { ProcessFlowController } from './processFlow/processFlow.controller';
import { ProcessFlowService } from './processFlow/processFlow.service';

@Module({
  controllers: [
    ProcessController,
    ProcessNodeController,
    ProcessFlowController,
  ],
  providers: [
    ...processProviders,
    ProcessService,
    ProcessConstraint,
    ProcessNodeService,
    ProcessFlowService,
  ],
  imports: [
    DatabaseModule,
    forwardRef(() => IterationModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => TaskModule),
  ],
  exports: [ProcessService, ProcessNodeService, ProcessFlowService],
})
export class ProcessModule { }
