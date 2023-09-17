import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BusinessException } from '@app/common';
import { PrivilegeService } from '../privilege/privilege.service';
import { RolePrivilegeService } from '../role-privilege/role-privilege.service';
import { SystemService } from '../system/system.service';
import { CreateRoleDto, DeleteRoleDto, GetPrivilegeListByIdDto, RoleListDto, RoleListWithPaginationDto, RolePrivilegeSetDto, UpdateRoleDto } from './role.dto';
import { RoleService } from './role.service';

@Controller('role')
@ApiTags('角色')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly rolePrivilegeService: RolePrivilegeService,
    private readonly privilegeService: PrivilegeService,
    private readonly systemService: SystemService,
  ) {
  }

  @ApiOperation({
    summary: '创建新角色',
  })
  @Post('create')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({
    summary: '修改角色信息',
  })
  @Post('update')
  async update(@Body() dto: UpdateRoleDto) {
    const foundRole = await this.roleService.findById(dto.id)
    if (!foundRole) {
      throw new BusinessException('未找到角色');
    }
    return await this.roleService.update({ ...foundRole, ...dto });
  }

  @ApiOperation({
    summary: '删除角色',
    description: '如果发现角色有绑定权限，权限将同步删除 Role - privilege 关系表',
  })
  @Post('/delete')
  async delete(@Body() dto: DeleteRoleDto) {
    return await this.roleService.delete(dto.id);
  }

  @ApiOperation({
    summary: '角色列表',
    description: '根据系统返回对应系统的角色列表',
  })
  @Post('/list')
  async list(@Body() dto: RoleListDto) {
    return await this.roleService.list(dto.systemId)
  }

  @ApiOperation({
    summary: '角色 ID 查权限',
    description: '根据角色 id 查权限列表',
  })
  @Post('/getPrivilegeListById')
  async getPrivilegeListById(@Body() dto: GetPrivilegeListByIdDto) {
    const rolePrivilegeList = await this.rolePrivilegeService.listByRoleIds([dto.roleId]);
    const privilegeList = await this.privilegeService.findByIds(rolePrivilegeList.map(rp => rp.privilegeId))
    return privilegeList;
  }

  @ApiOperation({
    summary: '角色列表（分页）',
    description: '根据角色名称查询',
  })
  @Post('/list/pagination')
  async listWithPagination(@Body() dto: RoleListWithPaginationDto) {
    const { page, ...searchParams } = dto;
    const pageData = await this.roleService.paginate(searchParams, page);
    const systemIds = pageData.items.map(role => role.systemId);
    const systemList = await this.systemService.findByIds(systemIds);
    const systemMap = {};
    systemList.forEach(system => systemMap[system.id] = system);
    const newRoles = pageData.items.map(role => {
      role['systemName'] = systemMap[role.systemId].name
      return role;
    })
    return { ...pageData, items: newRoles }
  }

  @ApiOperation({
    summary: '角色分配权限',
    description: '',
  })
  @Post('set')
  async set(@Body() dto: RolePrivilegeSetDto) {
    await this.rolePrivilegeService.remove(dto.roleId)
    return await this.rolePrivilegeService.set(dto.roleId, dto.privilegeIds, dto.systemId)
  }
}
