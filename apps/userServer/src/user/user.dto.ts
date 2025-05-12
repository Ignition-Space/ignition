/*
 * @Author: Cookie
 * @Description: 用户模块 dto
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserStatus } from './user.mongo.entity';

export class DisableUserDto {
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: '用户ID' })
  userId: number;

  @IsNotEmpty()
  @ApiProperty({ example: 1, description: '用户状态', enum: UserStatus })
  status: number;
}

export class GetRolesByIdDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: '用户ID' })
  userId: number;

  @ApiProperty({ example: 2, description: '系统ID' })
  systemId?: number;
}

export interface IBathRole {
  systemId: string;
  roleIds: string[];
}

export class SetRolesDto {
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: '用户ID' })
  userId: number;

  @IsNotEmpty()
  @ApiProperty({ example: 2, description: '系统id角色集合' })
  bathRoles: IBathRole[];
}

export class GetPrivilegeListDto {
  @ApiProperty({ example: 1, description: '用户ID' })
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  @ApiProperty({ example: '2', description: '系统ID' })
  systemId: number;
}

export class UserListWithPaginationDto {
  @ApiProperty({ example: '', description: '查询关键词' })
  keyword?: string;

  @ApiProperty({ example: { pageSize: 10, currentPage: 1 } })
  page?: PaginationParams;
}

export class CreateUserDto {
  username: string;
  password: string;
  email: string;
  mobile: string;
}

export class GithubUserInfo {
  accessToken?: string;
  email?: string;
  avatarUrl?: string;
  avatar_url?: string;
  avatarThumb?: string;
  avatarBig?: string;
  avatarMiddle?: string;
  mobile?: string;
  enName?: string;
  name?: string;
}
