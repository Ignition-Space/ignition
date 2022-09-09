import { Module } from '@nestjs/common';
import { InterfaceController } from './interface/interface.controller';
import { Interface } from './interface/interface.mongo.entity';
import { InterfaceService } from './interface/interface.service';
import { SiteController } from './site.controller';
import { Site } from './site.mongo.entity';
import { SiteService } from './site.service';

@Module({
  imports: [],
  controllers: [InterfaceController, SiteController],
  providers: [
    SiteService,
    InterfaceService,
    {
      provide: 'SITE_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(Site),
      inject: ['MONGODB_DATA_SOURCE'],
    },
    {
      provide: 'INTERFACE_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(Interface),
      inject: ['MONGODB_DATA_SOURCE'],
    },
  ],
  exports: [InterfaceService, SiteService],
})
export class SiteModule { }
