import { Module } from '@nestjs/common';
import { DatabaseModule, TransformInterceptor } from './core';
import { SiteModule } from './site/site.module';
import { PageModule } from './pages/page.module';
import { MaterialModule } from './materials/material/material.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
  imports: [DatabaseModule, SiteModule, PageModule, MaterialModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
