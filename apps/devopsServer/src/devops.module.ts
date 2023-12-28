import { Module } from '@nestjs/common';

import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import type { RedisClientOptions } from 'redis';

import { ConfigModule } from '@nestjs/config';
import { TransformInterceptor, getConfig } from '@app/common';
import { ProcessModule } from './iteration/process/process.module';
import { IterationModule } from './iteration/iteration.module';
import { TaskModule } from './deploy/task/task.module';
import { RepositoryModule } from './common/repository/repository.module';
import { BranchModule } from './branch/branch.module';
import { ThirdMiniProgramModule } from './project/third-mini-program/third-mini-program.module';
import { ProjectConfigurationModule } from './project/project-configuration/project-configuration.module';
import { JenkinsModule } from './common/jenkins/jenkins.module';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig],
    }),
    IterationModule,
    ProcessModule,
    TaskModule,
    RepositoryModule,
    BranchModule,
    ThirdMiniProgramModule,
    ProjectConfigurationModule,
    JenkinsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
  controllers: [],
})
export class MaterialsModule { }
