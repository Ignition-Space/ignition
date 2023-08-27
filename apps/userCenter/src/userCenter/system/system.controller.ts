import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BusinessException } from '@app/common';
import { CreateSystemDto, DeleteSystemDto, UpdateSystemDto } from './system.dto';
import { SystemService } from './system.service';
import { PayloadUser } from '@app/common';

@ApiTags('系统')
@Controller('system')
export class SystemController {
  constructor(
    private readonly systemService: SystemService
  ) { }

  @ApiOperation({
    summary: '创建新系统',
  })
  @Post('create')
  create(
    @Body() dto: CreateSystemDto,
    @PayloadUser() user: Payload
  ) {
    return this.systemService.create({
      ...dto,
      creatorName: user.name,
      creatorId: user.userId
    });
  }

  @ApiOperation({
    summary: '修改系统信息',
  })
  @Post('update')
  async update(@Body() dto: UpdateSystemDto,) {
    const foundSystem = await this.systemService.findById(dto.id)

    if (!foundSystem) {
      throw new BusinessException('未找到系统');
    }

    return await this.systemService.update({ ...foundSystem, ...dto });
  }

  @ApiOperation({
    summary: '删除系统',
  })
  @Post('/delete')
  async delete(@Body() dto: DeleteSystemDto) {
    return await this.systemService.delete(dto.id);
  }

  @ApiOperation({
    summary: '所有系统列表',
  })
  @Post('/list')
  async list() {
    return await this.systemService.list()
  }
}
