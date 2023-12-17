import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectTypeService } from './project-type.service';

@ApiTags('项目类型')
@Controller('projectType')
export class ProjectTypeController {
  constructor(private readonly projectTypeService: ProjectTypeService) { }

  @ApiOperation({
    summary: '初始化项目类型',
  })
  @Post('/insert')
  async save() {
    const projectTypes = [
      {
        name: 'web',
        type: 'web',
      },
      {
        name: '微信小程序',
        type: 'weapp',
      },
      {
        name: '百度小程序',
        type: 'swan',
      },
      {
        name: '支付宝小程序',
        type: 'alipay',
      },
      {
        name: 'npm 包',
        type: 'npm',
      },
    ];
    return await this.projectTypeService.save(projectTypes);
  }

  @Post('list')
  @ApiOperation({
    summary: '获取项目类型列表',
  })
  async getProjectTypeList() {
    return this.projectTypeService.listProjectTypes();
  }
}
