import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
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
import { Process } from './process.entity';
import { ProcessNode } from './processNode/processNode.entity';
import { ProcessFlow } from './processFlow/processFlow.entity';

@Module({
  controllers: [
    ProcessController,
    ProcessNodeController,
    ProcessFlowController,
  ],
  providers: [
    {
      provide: 'PROCESS_REPOSITORY',
      useFactory: (AppDataSource) => AppDataSource.getRepository(Process),
      inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
    },
    {
      provide: 'PROCESS_NODE_REPOSITORY',
      useFactory: (AppDataSource) => AppDataSource.getRepository(ProcessNode),
      inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
    },
    {
      provide: 'PROCESS_FLOW_REPOSITORY',
      useFactory: (AppDataSource) => AppDataSource.getRepository(ProcessFlow),
      inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
    },
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
