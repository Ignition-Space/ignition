import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserProviders } from './user.providers';

import { DatabaseModule } from '@app/common';
import { RolePrivilegeModule } from '../role-privilege/role-privilege.module';
import { UserRoleModule } from '../user-role/user-role.module';
import { RoleModule } from '../role/role.module';
import { PrivilegeModule } from '../privilege/privilege.module';
import { FeishuService } from './feishu/feishu.service';

@Module({
  controllers: [UserController],
  providers: [...UserProviders, UserService, FeishuService],
  imports: [
    forwardRef(() => DatabaseModule),
    RolePrivilegeModule,
    UserRoleModule,
    RoleModule,
    PrivilegeModule
  ],
  exports: [UserService, FeishuService],
})

export class UserModule { }
