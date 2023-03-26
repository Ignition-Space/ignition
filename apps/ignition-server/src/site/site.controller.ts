import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddSiteDto, GenerateSiteDto } from './site.dto';
import { SiteService } from './site.service';
import { getRecursion } from '../utils/analysis';
import * as _ from 'loadsh';
import { InterfaceService } from './interface/interface.service';

@ApiTags('站点配置')
@Controller('site')
export class SiteController {
  constructor(
    private readonly siteService: SiteService,
    private readonly interfaceService: InterfaceService,
  ) { }

  @ApiOperation({
    summary: '站点新增与更新',
  })
  @Post('saveAndUpdate')
  async saveAndUpdate(@Body() params: AddSiteDto) {
    const site = await this.siteService.saveAndUpdate(params);
    return site;
  }

  @ApiOperation({
    summary: '获取站点列表',
  })
  @Post('getList')
  async getList() {
    console.log(this.siteService)
    const site = await this.siteService.findALL();
    console.log('site====>', site)
    return site;
  }

  @ApiOperation({
    summary: '分析接口数据',
  })
  @Post('analysis')
  async analysis(@Body() generateSiteDto: GenerateSiteDto) {
    const site = await this.siteService.findOne(generateSiteDto.id);
    console.log('site===>', site)
    const { paths, components } = await getRecursion(site.url);
    const interfaces = [];

    Object.keys(paths).forEach((url) => {
      Object.keys(paths[url]).forEach((methodType) => {
        const request = paths[url][methodType];
        if (methodType === 'post') {
          !request?.requestBody &&
            interfaces.push({
              siteId: String(site.id),
              methodType: methodType,
              url,
              summary: request.summary,
              schema: '',
              apiType: site.apiType,
              parameterType: '',
              tags: request.tags,
            });
          request?.requestBody?.content &&
            Object.keys(request.requestBody.content).forEach((contentType) => {
              const schema = request.requestBody.content[contentType].schema;
              let reSchema = {};
              if (schema['$ref']) {
                const reSchemaList = schema['$ref'].split('/');
                reSchemaList.splice(0, 2);
                reSchema = _.get(components, reSchemaList);
              }
              interfaces.push({
                siteId: String(site.id),
                methodType: methodType,
                url,
                summary: request.summary,
                schema: reSchema,
                apiType: site.apiType,
                parameterType: contentType,
                tags: request.tags,
              });
            });
        }
        if (methodType === 'get') {
          interfaces.push({
            siteId: String(site.id),
            methodType: methodType,
            url,
            summary: request.summary,
            schema: request.parameters,
            apiType: site.apiType,
            parameterType: 'query',
            tags: request.tags,
          });
        }
      });
    });
    console.log(interfaces)
    const callback = [];
    for (const inter of interfaces) {
      const isExit = await this.interfaceService.findByUrl(
        String(site.id),
        inter.url,
      );
      let newOne = {};

      if (isExit) {
        newOne = await this.interfaceService.saveAndUpdate({
          ...isExit,
          ...inter,
        });
      } else {
        newOne = await this.interfaceService.saveAndUpdate(inter);
      }
      callback.push(newOne);
    }

    return callback;
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
