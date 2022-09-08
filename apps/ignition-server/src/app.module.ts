import { Module } from '@nestjs/common';
import { DatabaseModule } from './core';
import { SiteModule } from './site/site.module';
import { PageModule } from './pages/page.module';
import { MaterialModule } from './materials/material/material.module';
@Module({
  imports: [DatabaseModule, SiteModule, PageModule, MaterialModule],
})
export class AppModule { }
