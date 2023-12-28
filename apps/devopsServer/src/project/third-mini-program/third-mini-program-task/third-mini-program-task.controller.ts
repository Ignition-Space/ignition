import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ThirdMiniProgramTaskListDto,
  ThirdMiniProgramTaskSearchDto,
} from './third-mini-program-task.dto';
import { ThirdMiniProgramTaskService } from './third-mini-program-task.service';
import { TaskService } from '@devopsServer/deploy/task/task.service';
import { ThirdMiniProgramService } from '@devopsServer/project/third-mini-program/third-mini-program.service';

import { IThirdMiniProgramStatus } from '@devopsServer/project/third-mini-program/third-mini-program.entity';
import { Public } from '@app/common';

@ApiTags('第三方小程序')
@Controller('third-mini-program-task')
export class ThirdMiniProgramTaskController {
  constructor(
    private readonly thirdMiniProgramTaskService: ThirdMiniProgramTaskService,
    private readonly thirdMiniProgramService: ThirdMiniProgramService,
    private readonly taskService: TaskService,
  ) { }

  @ApiOperation({
    summary: '添加操作三方小程序子任务',
  })
  @Post('create')
  @Public()
  async create(@Body() createDto: ThirdMiniProgramTaskListDto) {
    const taskIds = createDto.tasks.map((task) => task.thirdMiniProgramId);
    console.log(createDto);
    const reThirdMiniProgramList = await this.thirdMiniProgramService.findByIds(
      taskIds,
      createDto.projectId,
      createDto.environment,
    );

    console.log(reThirdMiniProgramList);

    // 生产环境同步最新的 extJson
    const thirdMiniProgramList = reThirdMiniProgramList.map(
      (thirdMiniProgram) => {
        const { extJson, qrCodeUrl, templateId, currentVersion } =
          createDto.tasks.filter(
            (task) => thirdMiniProgram.id === task.thirdMiniProgramId,
          )[0];
        return {
          ...thirdMiniProgram,
          extJson: JSON.stringify(extJson),
          qrCodeUrl,
          templateId,
          currentVersion,
          status: IThirdMiniProgramStatus.waitPublish,
        };
      },
    );

    this.thirdMiniProgramService.createOrUpdate(thirdMiniProgramList);

    this.thirdMiniProgramTaskService.createOrUpdate(
      createDto.tasks.map((task) => {
        return {
          taskId: task.taskId,
          projectId: task.projectId,
          thirdMiniProgramId: task.thirdMiniProgramId,
          thirdMiniProgramName: task.thirdMiniProgramName,
          status: task.status,
        };
      }),
    );
    return true;
  }

  @ApiOperation({
    summary: '获取第三方小程序子任务列表',
  })
  @Post('getList')
  @Public()
  async getList(@Body() searchDto: ThirdMiniProgramTaskSearchDto) {
    const data = await this.thirdMiniProgramTaskService.getList(searchDto);
    return data;
  }
}
