import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BusinessException } from '../../core';

@ApiTags('物料库配置')
@Controller('group')
export class GroupController {
  constructor() {}

  @Post('getList')
  async getList() {}

  @Post('getMonorepoDetail')
  async getMonorepoGroupDetail() {}

  @Post('del')
  del() {}
}
