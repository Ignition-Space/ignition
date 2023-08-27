import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { SystemModule } from '../system/system.module';
import { ResourceModule } from '../resource/resource.module';
import { PrivilegeController } from './privilege.controller';
import { PrivilegeProviders } from './privilege.providers';
import { PrivilegeService } from './privilege.service';

@Module({
  controllers: [PrivilegeController],
  providers: [PrivilegeService, ...PrivilegeProviders],
  imports: [DatabaseModule, SystemModule, ResourceModule],
  exports: [PrivilegeService],
})
export class PrivilegeModule { }
