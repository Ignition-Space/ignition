import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { ThirdMiniProgramTaskService } from './third-mini-program-task.service';
import { ThirdMiniProgramTaskController } from './third-mini-program-task.controller';
import { thirdMiniProgramTaskProviders } from './third-mini-program-task.providers';
import { TaskModule } from '../../../deploy/task/task.module';
import { ThirdMiniProgramModule } from '../third-mini-program.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => TaskModule),
    forwardRef(() => ThirdMiniProgramModule),
  ],
  providers: [ThirdMiniProgramTaskService, ...thirdMiniProgramTaskProviders],
  controllers: [ThirdMiniProgramTaskController],
  exports: [ThirdMiniProgramTaskService],
})
export class ThirdMiniProgramTaskModule { }
