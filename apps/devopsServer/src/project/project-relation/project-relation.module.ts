import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { ProjectRelationService } from './project-relation.service';
import { ProjectRelation } from './project-relation.entity';

@Module({
  providers: [
    ProjectRelationService,
    {
      provide: 'PROJECT_RELATION_REPOSITORY',
      useFactory: (AppDataSource) =>
        AppDataSource.getRepository(ProjectRelation),
      inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
    },
  ],
  imports: [DatabaseModule],
  exports: [ProjectRelationService],
})
export class ProjectRelationModule { }
