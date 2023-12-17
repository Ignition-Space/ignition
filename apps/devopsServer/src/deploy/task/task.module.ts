import { forwardRef, Module } from '@nestjs/common';
import { BranchModule } from '@devopsServer/branch/branch.module';
import { DatabaseModule } from '@app/common';
import { IterationModule } from '@devopsServer/iteration/iteration.module';
import { ProcessModule } from '@devopsServer/iteration/process/process.module';
import { ProjectModule } from '@devopsServer/project/project.module';
import { JenkinsModule } from '@devopsServer/common/jenkins/jenkins.module';
import { ProjectConfigurationModule } from '@devopsServer/project/project-configuration/project-configuration.module';
import { ThirdMiniProgramModule } from '@devopsServer/project/third-mini-program/third-mini-program.module';
import { RepositoryModule } from '@devopsServer/common/repository/repository.module';
import { TaskController } from './task.controller';
import { taskProviders } from './task.providers';
import { TaskService } from './task.service';
import { OperationModule } from '@devopsServer/system/operation/operation.module';
import { DeployHistoryController } from '../history/history.controller';
import { DeployHistoryModule } from '../history/history.module';

@Module({
  controllers: [TaskController, DeployHistoryController],
  providers: [TaskService, ...taskProviders],
  imports: [
    DatabaseModule,
    OperationModule,
    DeployHistoryModule,
    forwardRef(() => ProjectModule),
    forwardRef(() => ProcessModule),
    forwardRef(() => IterationModule),
    forwardRef(() => RepositoryModule),
    forwardRef(() => BranchModule),
    forwardRef(() => ThirdMiniProgramModule),
    forwardRef(() => ProjectConfigurationModule),
    forwardRef(() => JenkinsModule),
    forwardRef(() => RedisModule),
    forwardRef(() => FeishuModule),
    forwardRef(() => NacosModule),
    forwardRef(() => DomainModule),
  ],
  exports: [TaskService],
})
export class TaskModule { }
