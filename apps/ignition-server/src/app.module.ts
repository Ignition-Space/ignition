import { Module } from '@nestjs/common';
import { DatabaseModule } from './core';
import { SiteModule } from './site/site.module';

@Module({
  imports: [DatabaseModule, SiteModule],
})
export class AppModule { }
