import { forwardRef, Module } from '@nestjs/common';
import { BranchModule } from '@devopsServer/branch/branch.module';
import { IterationModule } from '@devopsServer/iteration/iteration.module';
import { ProcessModule } from '@devopsServer/iteration/process/process.module';
import { ProjectModule } from '@devopsServer/project/project.module';
import { JenkinsModule } from '@devopsServer/common/jenkins/jenkins.module';
import { ProjectConfigurationModule } from '@devopsServer/project/project-configuration/project-configuration.module';
import { ThirdMiniProgramModule } from '@devopsServer/project/third-mini-program/third-mini-program.module';
import { RepositoryModule } from '@devopsServer/common/repository/repository.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { OperationModule } from '@devopsServer/system/operation/operation.module';
import { DeployHistoryModule } from '@devopsServer/deploy/history/history.module';
import { Task } from './task.entity';

@Module({
  controllers: [TaskController],
  providers: [
    TaskService,
    {
      provide: 'TASK_REPOSITORY',
      useFactory: (AppDataSource) => AppDataSource.getRepository(Task),
      inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
    },
  ],
  imports: [
    OperationModule,
    forwardRef(() => DeployHistoryModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => ProcessModule),
    forwardRef(() => IterationModule),
    forwardRef(() => RepositoryModule),
    forwardRef(() => BranchModule),
    forwardRef(() => ThirdMiniProgramModule),
    forwardRef(() => ProjectConfigurationModule),
    forwardRef(() => JenkinsModule),
  ],
  exports: [TaskService],
})
export class TaskModule { }
