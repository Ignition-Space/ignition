import { Module, forwardRef } from '@nestjs/common';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { PageConfigService } from './config/pageConfig.service';
import { DeployConfigService } from './deploy/deployConfig.service';
import { Page } from './page.mongo.entity';
import { DeployConfig } from './deploy/deployConfig.mongo.entity';
import { PageConfig } from './config/pageConfig.mongo.entity';
import { SiteModule } from '../site/site.module';
import { ApplicationModule } from '@ignitionServer/application/application.module';
import { PageVersion } from './pageVersion.mongo.entity copy';

@Module({
  imports: [forwardRef(() => SiteModule), forwardRef(() => ApplicationModule)],
  controllers: [PageController],
  providers: [
    PageService,
    PageConfigService,
    DeployConfigService,
    {
      provide: 'PAGE_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(Page),
      inject: ['MONGODB_DATA_SOURCE'],
    },
    {
      provide: 'DEPLOY_CONFIG_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(DeployConfig),
      inject: ['MONGODB_DATA_SOURCE'],
    },
    {
      provide: 'PAGE_CONFIG_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(PageConfig),
      inject: ['MONGODB_DATA_SOURCE'],
    },
    {
      provide: 'PAGE_VERSION_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(PageVersion),
      inject: ['MONGODB_DATA_SOURCE'],
    },
  ],
  exports: [PageService, PageConfigService],
})
export class PageModule { }
