import { Module } from '@nestjs/common';
import { SiteModule } from '@ignitionServer/site/site.module';
import { PageModule } from '@ignitionServer/pages/page.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule, TransformInterceptor, getConfig } from '@app/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SiteModule,
    PageModule,
    DatabaseModule,
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
})
export class AppModule { }
