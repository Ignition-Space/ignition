import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { ThirdMiniProgramService } from './third-mini-program.service';
import { ThirdMiniProgramController } from './third-mini-program.controller';
import { ThirdMiniProgramConfigProviders } from './third-mini-program.providers';
import { IterationModule } from '@devopsServer/iteration/iteration.module';

@Module({
  providers: [ThirdMiniProgramService, ...ThirdMiniProgramConfigProviders],
  controllers: [ThirdMiniProgramController],
  imports: [DatabaseModule, forwardRef(() => IterationModule)],
  exports: [ThirdMiniProgramService],
})
export class ThirdMiniProgramModule { }
