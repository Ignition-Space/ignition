import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProcessNodeService } from '../processNode/processNode.service';
import { CreatProcessFlowDto } from './processFlow.dto';
import { ProcessFlow } from './processFlow.entity';
import { ProcessFlowService } from './processFlow.service';

@ApiTags('流程模板')
@Controller('processFlow')
export class ProcessFlowController {
  constructor(
    private readonly processFlowService: ProcessFlowService,
    private readonly processNodeService: ProcessNodeService,
  ) { }

  @ApiOperation({
    summary: '创建流程模板',
    description: '',
  })
  @Post('/createOrUpdate')
  async createOrUpdate(
    @Body() creatProcessNodeDto: CreatProcessFlowDto,
  ): Promise<ProcessFlow> {
    return this.processFlowService.createOrUpdate(creatProcessNodeDto);
  }

  @ApiOperation({
    summary: '获取流程模板列表',
    description: '',
  })
  @Post('/getList')
  async findByAll(): Promise<any> {
    const flowList: any = await this.processFlowService.findByAll();

    const callbackList: any = [];
    for (const flow of flowList) {
      const nodeList = await this.processNodeService.findByIds(flow.nodeIds);
      // console.log(nodeList)
      // flow = {
      //   ...flow,
      //   nodeList
      // }
      callbackList.push({
        ...flow,
        nodeList,
      });
    }
    return callbackList;
  }
}
