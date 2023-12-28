import { Module } from '@nestjs/common';
import { SiteModule } from '@ignitionServer/site/site.module';
import { PageModule } from '@ignitionServer/pages/page.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule, TransformInterceptor } from '@app/common';
@Module({
  imports: [SiteModule, PageModule, DatabaseModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule { }
