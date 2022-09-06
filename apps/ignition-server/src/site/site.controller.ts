import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddSiteDto, GenerateSiteDto } from './site.dto';
import { SiteService } from './site.service';

@ApiTags('站点配置')
@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) { }

  @ApiOperation({
    summary: '站点新增与更新',
  })
  @Post('saveAndUpdate')
  async saveAndUpdate(@Body() params: AddSiteDto) {
    const page = await this.siteService.saveAndUpdate(params);
    return page;
  }

  @ApiOperation({
    summary: '站点详情',
  })
  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.siteService.findOne(id);
  }

  @ApiOperation({
    summary: '生成前端系统工程',
  })
  @Post('/generate')
  generate(@Body() generateSiteDto: GenerateSiteDto) {
    return generateSiteDto;
  }
}
