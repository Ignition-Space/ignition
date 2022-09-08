import { Controller, Post, Body, Get, Res, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BusinessException, Public } from '../core';
import {
  addPageDto,
  findPageDto,
  PageRestoreDto,
  searchPageDto,
  updatePageDto,
} from './page.dto';
import { PageService } from './page.service';
import { Response } from 'express';
import { PageConfigService } from './config/pageConfig.service';
import { SiteService } from '../site/site.service';
import { STATUS_TYPE } from '../site/site.mongo.entity';
import { DeployConfigService } from './deploy/deployConfig.service';

import * as nunjucks from 'nunjucks';

@ApiTags('页面配置')
@Controller('page')
export class PageController {
  constructor(
    private pageService: PageService,
    private pageConfigService: PageConfigService,
    // private templateService: TemplateService,
    private siteService: SiteService,
    private deployConfigService: DeployConfigService,
  ) { }

  @ApiOperation({
    summary: '生成页面',
  })
  @Post('save')
  async save(@Body() params: addPageDto) {
    const { siteId } = params;

    const site = await this.siteService.findOne(siteId);

    if (!site) {
      throw new BusinessException('站点项目部村长！');
    }

    const exit = await this.pageService.findOneByQuery({
      siteId: params.siteId,
      path: params.path,
    });

    if (exit) {
      throw new BusinessException('页面路径重复！');
    }

    const page = await this.pageService.save(params);

    return page;
  }

  @ApiOperation({
    summary: '获取页面详情',
  })
  @Post('getDetail')
  async findOne(@Body() params: findPageDto) {
    const page = await this.pageService.findOne(params.id);
    const pageConfig = await this.pageConfigService.findOne(
      page.currentConfigId,
    );

    if (page.currentConfigId) {
      if (typeof pageConfig.config == 'string') {
        pageConfig.config = JSON.parse(pageConfig.config);
      }
      return {
        ...page,
        config: {
          ...pageConfig,
          config: pageConfig.config || {},
        },
      };
    }

    return {
      ...page,
      config: {},
    };
  }

  @ApiOperation({
    summary: '根据站点获取页面列表',
  })
  @Post('getList')
  async getList(@Body() params: searchPageDto) {
    return this.pageService.findAll(params);
  }

  @ApiOperation({
    summary: '删除页面',
  })
  @Post('del')
  async del(@Body() params: findPageDto) {
    const { id } = params;
    return this.pageService.updateOne(id, {
      status: STATUS_TYPE.deleted,
    });
  }

  @ApiOperation({
    summary: '更新页面',
  })
  @Post('update')
  async update(@Body() params: updatePageDto) {
    const { id, ...rest } = params;
    return this.pageService.updateOne(id, {
      ...rest,
    });
  }

  async packageHtml(params) {
    const { id } = params;
    const page = await this.pageService.findOne(id);
    if (!page) {
      throw new BusinessException('找不到对应的页面');
    }
    if (!page.templateId) {
      throw new BusinessException('该页面没有对应的模板');
    }
    if (!page.currentConfigId) {
      throw new BusinessException('该页面没有对应的配置');
    }

    const config: any = await this.pageConfigService.findOne(
      page.currentConfigId,
    );
    const deployConfig: any = await this.deployConfigService.findOne(
      page.deployConfigId,
    );
    // const template = await this.templateService.findOne(page.templateId);

    // if (typeof config.config != 'string') {
    //   config.config = JSON.stringify(config.config);
    // }

    // let html = nunjucks.renderString(template.contain, {
    //   pageInfo: config.config,
    // });

    // html = html.replace(/\\n/g, '');

    return {
      config,
      // html,
      deployConfig,
    };
  }

  @ApiOperation({
    summary: '获取页面配置',
  })
  @ApiQuery({
    name: 'id',
    description: '页面id',
  })
  @Public()
  @Get('getConfig')
  async getConfig(@Query('id') id, @Query('pushType') pushType = 0) {
    const { config } = await this.packageHtml({ id, pushType, env: 3 });
    return config;
  }

  @ApiOperation({
    summary: '获取页面发布历史',
  })
  @ApiQuery({
    name: 'id',
    description: '页面id',
  })
  @Get('getPublishHistory')
  async getPublishHistory(@Query('id') id, @Query('pushType') pushType = 0) {
    const deployConfig: any = await this.deployConfigService.findAll({
      pageId: id,
    });
    return deployConfig;
  }

  @ApiOperation({
    summary: '回滚',
  })
  @Post('restore')
  async restore(@Body() params: PageRestoreDto) {
    const deployConfig = await this.deployConfigService.findOne(
      params.snapshotId,
    );
    if (deployConfig) {
      return this.pageService.updateOne(params.pageId, {
        deployConfigId: params.snapshotId,
        currentConfigId: deployConfig.configId,
      });
    } else if (await this.pageConfigService.findOne(params.snapshotId)) {
      return this.pageService.updateOne(params.pageId, {
        currentConfigId: params.snapshotId,
      });
    }
    throw new BusinessException('该页面没有对应的配置');
  }

  @ApiOperation({
    summary: '页面预览',
  })
  @ApiQuery({
    name: 'id',
    description: '页面id',
  })
  @Get('preview')
  async preview(
    @Query('id') id,
    @Query('pushType') pushType = 0,
    @Res() res: Response,
  ) {
    // const { html } = await this.packageHtml({ id, pushType, env: 3 });
    // res.send(html);
  }
}
