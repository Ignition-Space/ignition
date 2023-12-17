import { Module } from '@nestjs/common';
import { ProjectTypeService } from './project-type.service';
import { ProjectTypeController } from './project-type.controller';
import { projectTypeProviders } from './project-type.providers';
import { ProjectTypeConstraint } from './project-type.validator';
import { DatabaseModule } from '@app/common';

@Module({
  providers: [
    ProjectTypeService,
    ...projectTypeProviders,
    ProjectTypeConstraint,
  ],
  imports: [DatabaseModule],
  controllers: [ProjectTypeController],
  exports: [ProjectTypeService],
})
export class ProjectTypeModule { }
