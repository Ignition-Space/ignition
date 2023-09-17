import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BusinessException } from '@app/common';
import { SystemService } from '../system/system.service';
import { ResourceService } from '../resource/resource.service';
import { CreatePrivilegeDto, DeletePrivilegeDto, DisablePrivilegeDto, ListAllPrivilegeDto, PrivilegeListWithPaginationDto, UpdatePrivilegeDto } from './privilege.dto';
import { Privilege } from './privilege.mysql.entity';
import { PrivilegeService } from './privilege.service';

@ApiTags('权限')
@Controller('privilege')
export class PrivilegeController {
  constructor(
    private readonly privilegeService: PrivilegeService,
    private readonly resourceService: ResourceService,
    private readonly systemService: SystemService
  ) { }

  @ApiOperation({
    summary: '创建权限',
  })
  @Post('create')
  async create(@Body() dto: CreatePrivilegeDto) {
    const privilege: Privilege = {
      systemId: dto.systemId,
      name: dto.name,
      resourceKey: dto.resourceKey,
      action: dto.action,
      description: dto.description
    }
    const resource = await this.resourceService.findByKey(dto.resourceKey);
    if (!resource) {
      throw new BusinessException('未找到资源 Key:' + dto.resourceKey);
    }
    return this.privilegeService.createOrUpdate(privilege);
  }

  @ApiOperation({
    summary: '修改权限',
  })
  @Post('update')
  async update(@Body() dto: UpdatePrivilegeDto) {
    const updatedPrivilege: Privilege = {
      name: dto.name,
      systemId: dto.systemId,
      resourceKey: dto.resourceKey,
      action: dto.action,
      description: dto.description
    }

    const privilege = await this.privilegeService.findById(dto.id)

    if (!privilege) {
      throw new BusinessException(`未找到 id 为 ${dto.id} 的权限`);
    }

    const resource = await this.resourceService.findByKey(dto.resourceKey);
    if (!resource) {
      throw new BusinessException('未找到资源 Key:' + dto.resourceKey);
    }

    return this.privilegeService.createOrUpdate({ ...privilege, ...updatedPrivilege });
  }

  @ApiOperation({
    summary: '是否冻结权限',
  })
  @Post('changeStatus')
  async changeStatus(@Body() dto: DisablePrivilegeDto) {
    const found = await this.privilegeService.findById(dto.privilegeId);
    if (!found) {
      throw new BusinessException(`未找到 ID 为 ${dto.privilegeId} 的权限`);
    }
    return this.privilegeService.createOrUpdate({ ...found, status: dto.status });
  }

  @ApiOperation({
    summary: '删除权限',
  })
  @Post('delete')
  async delete(@Body() dto: DeletePrivilegeDto) {
    return this.privilegeService.delete(dto.privilegeId);
  }

  @ApiOperation({
    summary: '权限列表（分页）',
    description: '根据权限名称查询',
  })
  @Post('/list/pagination')
  async listWithPagination(@Body() dto: PrivilegeListWithPaginationDto) {
    const { page, ...searchParams } = dto;

    const pageData = await this.privilegeService.paginate(searchParams, page);
    const systemIds = pageData.items.map(privilege => privilege.systemId);
    const systemList = await this.systemService.findByIds(systemIds);
    const systemMap = {};
    systemList.forEach(system => systemMap[system.id] = system);
    const newRoles = pageData.items.map(privilege => {
      privilege['systemName'] = systemMap[privilege.systemId].name
      return privilege;
    })
    return { ...pageData, items: newRoles }
  }

  @ApiOperation({
    summary: '获取所有权限',
  })
  @Post('list')
  async list(@Body() dto: ListAllPrivilegeDto) {
    return await this.privilegeService.list(dto.systemId);
  }
}
