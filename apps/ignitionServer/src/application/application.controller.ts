import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as _ from 'lodash';
import { ApplicationService } from './application.service';
import { AppDetailDto, AppUpateDto } from './application.dto';
import { PayloadUser } from '@app/common';
import { DomainService } from './domain/domain.service';
import { DELETE_FALG } from './application.mongo.entity';

@ApiTags('应用配置')
@Controller('application')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly domainService: DomainService,
  ) { }

  @ApiOperation({
    summary: '应用新增与更新',
  })
  @Post('saveAndUpdate')
  async saveAndUpdate(
    @Body() params: AppUpateDto,
    @PayloadUser() user: IPayloadUser,
  ) {
    const { domains: domainsDto, ...rest } = params;

    const { userId, username } = user;

    await this.domainService.saveAndUpdate(domainsDto);

    if (rest.id) {
      return this.applicationService.saveAndUpdate({
        ...rest,
        updatedUser: username,
        updatedId: userId,
      });
    }
    return this.applicationService.saveAndUpdate({
      ...rest,
      createdUser: username,
      createdId: userId,
    });
  }

  @ApiOperation({
    summary: '获取应用列表',
  })
  @Post('getList')
  async getList() {
    const application = await this.applicationService.findALL();
    return application;
  }

  @ApiOperation({
    summary: '删除应用',
  })
  @Post('delete')
  async deletePage(
    @Body() app: AppDetailDto,
    @PayloadUser() user: IPayloadUser,
  ) {
    const { id } = app;

    const orginApp = await this.applicationService.findOne(id);

    const { userId, username } = user;

    return this.applicationService.saveAndUpdate({
      ...orginApp,
      deleteFlag: DELETE_FALG.disabled,
      updatedUser: username,
      updatedId: userId,
    });
  }

  @ApiOperation({
    summary: '应用详情',
  })
  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.applicationService.findOne(id);
  }
}
