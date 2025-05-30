import { forwardRef, Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

import { DatabaseModule } from '@app/common';
import { RepositoryService } from '../common/repository/repository.service';
import { ProjectConstraint } from './project.validator';
import { ProjectTypeModule } from '@devopsServer/project/project-type/project-type.module';
import { IterationModule } from '@devopsServer/iteration/iteration.module';
import { OperationModule } from '@devopsServer/system/operation/operation.module';
import { ProjectConfigurationModule } from '@devopsServer/project/project-configuration/project-configuration.module';

import { ThirdMiniProgramConfigModule } from '@devopsServer/project/third-mini-program/third-mini-program-config/third-mini-program-config.module';
import { UserStaredProject } from './user-star-project.mongo.entity';
import { Project } from './project.mongo.entity';
import { ProjectRelation } from './project-relation/project-relation.mongo.entity';
import { ProjectRelationModule } from './project-relation/project-relation.module';

@Module({
  controllers: [ProjectController],
  providers: [
    {
      provide: 'USER_STAR_PROJECT_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(UserStaredProject),
      inject: ['MONGODB_DATA_SOURCE'],
    },
    {
      provide: 'PROJECT_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(Project),
      inject: ['MONGODB_DATA_SOURCE'],
    },
    {
      provide: 'ProjectRelationService',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(ProjectRelation),
      inject: ['MONGODB_DATA_SOURCE'],
    },
    ProjectService,
    RepositoryService,
    ProjectConstraint,
  ],
  imports: [
    OperationModule,
    DatabaseModule,
    ProjectTypeModule,
    ProjectRelationModule,
    forwardRef(() => ThirdMiniProgramConfigModule),
    forwardRef(() => IterationModule),
    forwardRef(() => ProjectConfigurationModule),
  ],
  exports: [ProjectService],
})
export class ProjectModule { }
