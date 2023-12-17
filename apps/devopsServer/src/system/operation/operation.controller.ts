import { Body, Controller, Post } from '@nestjs/common';
import { OperationService } from './operation.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListOperationDto } from './operation.dto';

@ApiTags('操作')
@Controller('operation')
export class OperationController {
  constructor(private readonly operationService: OperationService) { }

  @ApiOperation({
    summary: '获取最新动态',
  })
  @Post('list')
  async list(@Body() dto: ListOperationDto) {
    return await this.operationService.list(dto);
  }
}
