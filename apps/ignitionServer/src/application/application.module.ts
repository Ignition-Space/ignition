import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Application } from './application.mongo.entity';
import { ApplicationController } from './application.controller';
import { Domain } from './domain/domain.mongo.entity';
import { DomainService } from './domain/domain.service';

@Module({
  imports: [],
  controllers: [ApplicationController],
  providers: [
    ApplicationService,
    DomainService,
    {
      provide: 'APP_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(Application),
      inject: ['MONGODB_DATA_SOURCE'],
    },
    {
      provide: 'DOMAIN_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(Domain),
      inject: ['MONGODB_DATA_SOURCE'],
    },
  ],
  exports: [ApplicationService],
})
export class ApplicationModule { }
