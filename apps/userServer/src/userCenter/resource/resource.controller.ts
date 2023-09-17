import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BusinessException } from '@app/common';
import { CreateResourceDto, DeleteResourceDto, ListBySystemIdDto, ResourceListWithPaginationDto, UpdateResourceDto } from './resource.dto';
import { ResourceService } from './resource.service';

@Controller('resource')
@ApiTags('资源')
export class ResourceController {
  constructor(
    private readonly resourceService: ResourceService
  ) { }

  @ApiOperation({
    summary: '创建新资源',
  })
  @Post('create')
  async create(@Body() dto: CreateResourceDto) {
    const foundResource = await this.resourceService.findByKey(dto.key)

    if (foundResource) {
      throw new BusinessException('资源 Key 已存在');
    }

    return await this.resourceService.create(dto);
  }

  @ApiOperation({
    summary: '修改资源信息',
  })
  @Post('update')
  async update(@Body() dto: UpdateResourceDto) {

    const foundResource = await this.resourceService.findById(dto.id)

    if (!foundResource) {
      throw new BusinessException('未找到资源');
    }
    const allowUpdateFields = {
      name: dto.name,
    }

    return await this.resourceService.update({ ...foundResource, ...allowUpdateFields });
  }

  @ApiOperation({
    summary: '删除资源',
    description: '',
  })
  @Post('/delete')
  async delete(@Body() dto: DeleteResourceDto) {
    return await this.resourceService.delete(dto.id);
  }

  @ApiOperation({
    summary: '资源列表',
    description: '根据角色名称查询',
  })
  @Post('/listBySystemId')
  async listBySystemId(@Body() dto: ListBySystemIdDto) {
    return await this.resourceService.listBySystemId(dto.systemId)
  }

}
