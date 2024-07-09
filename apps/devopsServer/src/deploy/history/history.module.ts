import { forwardRef, Module } from '@nestjs/common';
import { DeployHistoryService } from './history.service';
import { DeployHistoryController } from './history.controller';
import { IterationModule } from '@devopsServer/iteration/iteration.module';
import { ProjectModule } from '@devopsServer/project/project.module';
import { TaskModule } from '../task/task.module';
import { DeployHistory } from './history.entity';

@Module({
  controllers: [DeployHistoryController],
  providers: [
    {
      provide: 'DEPLOY_HISTORY_REPOSITORY',
      useFactory: (AppDataSource) => AppDataSource.getRepository(DeployHistory),
      inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
    },
    DeployHistoryService,
  ],
  imports: [
    forwardRef(() => ProjectModule),
    forwardRef(() => IterationModule),
    forwardRef(() => TaskModule),
  ],
  exports: [DeployHistoryService],
})
export class DeployHistoryModule { }
