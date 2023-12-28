import { forwardRef, Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { projectProviders } from './project.providers';

import { DatabaseModule } from '@app/common';
import { RepositoryService } from '../common/repository/repository.service';
import { ProjectConstraint } from './project.validator';
import { ProjectTypeModule } from '@devopsServer/project/project-type/project-type.module';
import { IterationModule } from '@devopsServer/iteration/iteration.module';
import { OperationModule } from '@devopsServer/system/operation/operation.module';
import { ProjectConfigurationModule } from '@devopsServer/project/project-configuration/project-configuration.module';

import { ThirdMiniProgramConfigModule } from '@devopsServer/project/third-mini-program/third-mini-program-config/third-mini-program-config.module';

@Module({
  controllers: [ProjectController],
  providers: [
    ...projectProviders,
    ProjectService,
    RepositoryService,
    ProjectConstraint,
  ],
  imports: [
    OperationModule,
    DatabaseModule,
    ProjectTypeModule,
    forwardRef(() => ThirdMiniProgramConfigModule),
    forwardRef(() => IterationModule),
    forwardRef(() => ProjectConfigurationModule),
  ],
  exports: [ProjectService],
})
export class ProjectModule { }
