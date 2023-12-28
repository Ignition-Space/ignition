import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { projectRelationProviders } from './project-relation.providers';
import { ProjectRelationService } from './project-relation.service';

@Module({
  providers: [ProjectRelationService, ...projectRelationProviders],
  imports: [DatabaseModule],
  exports: [ProjectRelationService],
})
export class ProjectRelationModule { }
