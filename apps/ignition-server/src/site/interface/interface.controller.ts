import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenerateDto } from './interface.dto';
import { InterfaceService } from './interface.service';

@ApiTags('接口配置')
@Controller('interface')
export class InterfaceController {
  constructor(private readonly interfaceService: InterfaceService) { }

  @ApiOperation({
    summary: '根据站点获取接口列表',
  })
  @Get('/site/:siteId')
  findBySite(@Param('siteId') siteId: string) {
    return this.interfaceService.findBySite(siteId);
  }

  @ApiOperation({
    summary: '获取单个接口信息',
  })
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.interfaceService.findOne(id);
  }

  @ApiOperation({
    summary: '生成单页面',
  })
  @Post('/generate')
  generate(@Body() generateDto: GenerateDto) {
    return generateDto;
  }
}
