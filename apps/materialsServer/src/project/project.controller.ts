import { PayloadUser } from '@app/common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddProjectDto } from './project.dto';

import { ProjectService } from './project.service';

@ApiTags('项目')
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) { }

  @ApiOperation({
    summary: '项目创建与更新',
  })
  @Post('createOrUpdate')
  create(@Body() addProjectDto: AddProjectDto, @PayloadUser() user: Payload) {
    return this.projectService.saveAndUpdate({
      ...addProjectDto,
      creatorId: user.userId,
      creatorName: user.name,
    });
  }

  @ApiOperation({
    summary: '项目列表',
  })
  @Post('getList')
  getList() {
    return this.projectService.findAll();
  }

  @ApiOperation({
    summary: '项目详情',
  })
  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }
}
