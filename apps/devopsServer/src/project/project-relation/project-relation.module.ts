import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { ProjectRelationService } from './project-relation.service';
import { ProjectRelation } from './project-relation.mongo.entity';

@Module({
  providers: [
    ProjectRelationService,
    {
      provide: 'PROJECT_RELATION_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(ProjectRelation),
      inject: ['MONGODB_DATA_SOURCE'],
    },
  ],
  imports: [DatabaseModule],
  exports: [ProjectRelationService],
})
export class ProjectRelationModule { }
