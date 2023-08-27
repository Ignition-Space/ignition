import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { DatabaseModule } from '@app/common';
import { ResourceProviders } from './resource.providers';

@Module({
  imports: [DatabaseModule],
  providers: [ResourceService, ...ResourceProviders],
  controllers: [ResourceController],
  exports: [ResourceService]
})
export class ResourceModule { }
