import { forwardRef, Module } from '@nestjs/common';

import { DatabaseModule } from '@app/common';
import { ThirdMiniProgramModule } from '@devopsServer/project/third-mini-program/third-mini-program.module';

import { ThirdMiniProgramConfigService } from './third-mini-program-config.service';
import { ThirdMiniProgramConfigController } from './third-mini-program-config.controller';
import { thirdMiniProgramConfigProviders } from './third-mini-program-config.providers';

@Module({
  controllers: [ThirdMiniProgramConfigController],
  providers: [
    ThirdMiniProgramConfigService,
    ...thirdMiniProgramConfigProviders,
  ],
  imports: [DatabaseModule, forwardRef(() => ThirdMiniProgramModule)],
  exports: [ThirdMiniProgramConfigService],
})
export class ThirdMiniProgramConfigModule { }
