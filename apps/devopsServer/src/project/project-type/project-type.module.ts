import { Module } from '@nestjs/common';
import { ProjectTypeService } from './project-type.service';
import { ProjectTypeController } from './project-type.controller';
import { ProjectTypeConstraint } from './project-type.validator';
import { DatabaseModule } from '@app/common';
import { ProjectType } from './project-type.mongo.entity';

@Module({
  providers: [
    ProjectTypeService,
    ProjectTypeConstraint,
    {
      provide: 'PROJECT_TYPE_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(ProjectType),
      inject: ['MONGODB_DATA_SOURCE'],
    },
  ],
  imports: [DatabaseModule],
  controllers: [ProjectTypeController],
  exports: [ProjectTypeService],
})
export class ProjectTypeModule { }
