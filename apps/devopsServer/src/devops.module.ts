import { Module } from '@nestjs/common';

import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import type { RedisClientOptions } from 'redis';

import { ConfigModule } from '@nestjs/config';
import { TransformInterceptor, getConfig } from '@app/common';

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
