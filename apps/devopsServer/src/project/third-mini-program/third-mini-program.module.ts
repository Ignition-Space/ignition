import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { ThirdMiniProgramService } from './third-mini-program.service';
import { ThirdMiniProgramController } from './third-mini-program.controller';
import { IterationModule } from '@devopsServer/iteration/iteration.module';
import { ThirdMiniProgram } from './third-mini-program.entity';

@Module({
  providers: [
    ThirdMiniProgramService,
    {
      provide: 'THIRD_MINI_PROGRAM_REPOSITORY',
      useFactory: (AppDataSource) =>
        AppDataSource.getRepository(ThirdMiniProgram),
      inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
    },
  ],
  controllers: [ThirdMiniProgramController],
  imports: [DatabaseModule, forwardRef(() => IterationModule)],
  exports: [ThirdMiniProgramService],
})
export class ThirdMiniProgramModule { }
