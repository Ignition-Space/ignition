import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublishStatus, Task } from '@devopsServer/deploy/task/task.entity';
import { PROCESS_NODE, Template } from '@devopsServer/utils/constants';
import { ProcessNodeService } from './processNode.service';
import { CreatProcessNodeDto } from './processNode.dto';
import { ProcessNode } from './processNode.entity';

@ApiTags('流程节点')
@Controller('processNode')
export class ProcessNodeController {
  constructor(private readonly processNodeService: ProcessNodeService) { }

  @ApiOperation({
    summary: '创建节点',
    description: '',
  })
  @Post('/createOrUpdate')
  async createOrUpdate(
    @Body() creatProcessNodeDto: CreatProcessNodeDto,
  ): Promise<ProcessNode> {
    return this.processNodeService.createOrUpdate(creatProcessNodeDto);
  }

  @ApiOperation({
    summary: '获取流程节点列表',
    description: '',
  })
  @Post('/getList')
  async findByAll(): Promise<ProcessNode[]> {
    return this.processNodeService.findByAll();
  }
}
