import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatSystemDto } from './system.dto';
import { System } from './system.entity';
import { SystemService } from './system.service';

@ApiTags('项目系统变量')
@Controller('System')
export class SystemController {
  constructor(private readonly systemService: SystemService) { }

  @ApiOperation({
    summary: '创建项目系统变量',
    description: '',
  })
  @Post('/createOrUpdate')
  async createOrUpdate(
    @Body() creatProcessNodeDto: CreatSystemDto,
  ): Promise<System> {
    return this.systemService.createOrUpdate(creatProcessNodeDto);
  }

  @ApiOperation({
    summary: '获取项目系统变量列表',
    description: '',
  })
  @Post('/getList')
  async findByAll(): Promise<System[]> {
    return this.systemService.findByAll();
  }
}
