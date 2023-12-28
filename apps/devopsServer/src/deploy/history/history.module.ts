import { forwardRef, Module } from '@nestjs/common';
import { DeployHistoryService } from './history.service';
import { DeployHistoryController } from './history.controller';
import { historyProviders } from './history.providers';
import { DatabaseModule } from '@app/common';
import { IterationModule } from '@devopsServer/iteration/iteration.module';
import { ProjectModule } from '@devopsServer/project/project.module';
import { TaskModule } from '../task/task.module';

@Module({
  controllers: [DeployHistoryController],
  providers: [...historyProviders, DeployHistoryService],
  imports: [
    DatabaseModule,
    forwardRef(() => ProjectModule),
    forwardRef(() => IterationModule),
    forwardRef(() => TaskModule),
  ],
  exports: [DeployHistoryService],
})
export class DeployHistoryModule { }
