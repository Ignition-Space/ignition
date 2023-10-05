import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import {
  UserListWithPaginationDto,
  GetRolesByIdDto,
  SetRolesDto,
  DisableUserDto,
} from './user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PayloadUser } from '@app/common';
import { UserRoleService } from '../user-role/user-role.service';
import { BusinessException } from '@app/common';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
  ) { }

  @ApiOperation({
    summary: '用户信息',
  })
  @Post('/profile')
  profile(@PayloadUser() user: Payload) {
    return this.userService.profile(user.userId);
  }

  @ApiOperation({
    summary: '是否激活用户',
  })
  @Post('changeStatus')
  async changeStatus(@Body() dto: DisableUserDto) {
    const found = await this.userService.getUserById(dto.userId);
    if (!found) {
      throw new BusinessException(`未找到 ID 为 ${dto.userId} 的用户`);
    }
    return this.userService.createOrSave({ ...found, status: dto.status });
  }

  @ApiOperation({
    summary: '用户列表（分页）',
  })
  @Post('/list/pagination')
  async listWithPagination(@Body() dto: UserListWithPaginationDto) {
    const { page, ...searchParams } = dto;
    return this.userService.paginate(searchParams, page);
  }

  @ApiOperation({
    summary: '通过用户 ID 获取角色列表',
  })
  @Post('/getAllRolesById')
  getAllRolesById(@Body() dto: GetRolesByIdDto) {
    return this.userService.getRolesById(dto.userId, dto.systemId);
  }

  @ApiOperation({
    summary: '通过用户 ID 获取角色列表',
  })
  @Post('/getRolesById')
  getRolesById(@Body() dto: GetRolesByIdDto) {
    return this.userService.getRolesById(dto.userId, dto.systemId);
  }

  @ApiOperation({
    summary: '设置用户角色批量',
  })
  @Post('/setRoles')
  async setRoles(@Body() dto: SetRolesDto) {
    return await this.userRoleService.setUserRoles(dto.userId, dto.bathRoles);
  }
}
