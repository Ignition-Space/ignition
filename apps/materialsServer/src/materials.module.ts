import { Module } from '@nestjs/common';

import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import type { RedisClientOptions } from 'redis';

import { ConfigModule } from '@nestjs/config';
import { TransformInterceptor, getConfig } from '@app/common';
import { GroupModule } from './group/group.module';
import { MaterialModule } from './material/material.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import * as redisStore from 'cache-manager-redis-store';
import { MicroservicesModule } from './microservices/microservices.module';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      host: getConfig('REDIS_CONFIG').host,
      port: getConfig('REDIS_CONFIG').port,
      auth_pass: getConfig('REDIS_CONFIG').auth,
      db: getConfig('REDIS_CONFIG').db,
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig],
    }),
    MicroservicesModule,
    GroupModule,
    TaskModule,
    MaterialModule,
    ProjectModule,
  ],
  controllers: [],
})
export class MaterialsModule { }
