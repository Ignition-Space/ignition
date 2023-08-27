/*
 * @Author: Cookie
 * @Description: 用户模块 dto
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaginationParams } from 'types/type';
import { UserStatus } from './user.mysql.entity';

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

  @IsNotEmpty()
  @ApiProperty({ example: 2, description: '系统ID' })
  systemId: number;
}

export class SetRolesDto {
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: '用户ID' })
  userId: number;

  @IsNotEmpty()
  @ApiProperty({ example: [1], description: '角色ID' })
  roleIds: number[];

  @IsNotEmpty()
  @ApiProperty({ example: 2, description: '系统ID' })
  systemId: number;
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
