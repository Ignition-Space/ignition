import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { DatabaseModule } from '@app/common';
import { ResourceProviders } from './resource.providers';
import { SystemModule } from '../system/system.module';

@Module({
  imports: [DatabaseModule, SystemModule],
  providers: [ResourceService, ...ResourceProviders],
  controllers: [ResourceController],
  exports: [ResourceService],
})
export class ResourceModule { }
