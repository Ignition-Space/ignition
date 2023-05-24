import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MaterialConfigService } from './config/materialConfig.service';

import { Public } from '../../core';
import { CodeGroupService } from '../group/code/code.service';

@ApiTags('物料')
@Controller('material')
export class MaterialController {
  constructor(private groupService: CodeGroupService) {}
}
