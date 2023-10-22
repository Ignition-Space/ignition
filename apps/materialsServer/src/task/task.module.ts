import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';;
import { GroupModule } from '../group/group.module';
import { MaterialModule } from '../material/material.module';
import { ProjectModule } from '../project/project.module';
import { TaskController } from './task.controller';
import { TaskProviders } from './task.providers';
import { TaskService } from './task.service';

@Module({
  imports: [
    DatabaseModule,
    ProjectModule,
    forwardRef(() => GroupModule),
    forwardRef(() => MaterialModule),
  ],
  controllers: [TaskController],
  providers: [TaskService, ...TaskProviders],
  exports: [TaskService],
})
export class TaskModule { }
