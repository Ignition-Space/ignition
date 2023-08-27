import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { UserRoleProviders } from './user-role.providers';
import { UserRoleService } from './user-role.service';

@Module({
  providers: [UserRoleService, ...UserRoleProviders],
  imports: [DatabaseModule],
  exports: [UserRoleService],
})

export class UserRoleModule { }
