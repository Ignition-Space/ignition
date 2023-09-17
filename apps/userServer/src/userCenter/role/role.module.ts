import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { DatabaseModule } from '@app/common';
import { RoleProviders } from './role.providers';
import { RolePrivilegeModule } from '../role-privilege/role-privilege.module';
import { PrivilegeModule } from '../privilege/privilege.module';
import { SystemModule } from '../system/system.module';

@Module({
  imports: [DatabaseModule, RolePrivilegeModule, PrivilegeModule, SystemModule],
  providers: [RoleService, ...RoleProviders],
  controllers: [RoleController],
  exports: [RoleService]
})
export class RoleModule { }
