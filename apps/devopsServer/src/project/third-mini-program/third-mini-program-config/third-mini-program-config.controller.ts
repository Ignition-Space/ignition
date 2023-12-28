import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ThirdMiniProgramConfig } from './third-mini-program-config.entity';
import { ThirdMiniProgramConfigDto } from './third-mini-program-config.dto';
import { ThirdMiniProgramConfigService } from './third-mini-program-config.service';
import { ThirdMiniProgramService } from '@devopsServer/project/third-mini-program/third-mini-program.service';
import { ThirdMiniProgram } from '@devopsServer/project/third-mini-program/third-mini-program.entity';
import { request } from '@app/common/utils/request';

@ApiTags('第三方小程序')
@Controller('third-mini-program-config')
export class ThirdMiniProgramConfigController {
  constructor(
    private readonly thirdMiniProgramConfigService: ThirdMiniProgramConfigService,
    private readonly thirdMiniProgramService: ThirdMiniProgramService,
  ) { }

  @ApiOperation({
    summary: '新建 OR 更新第三方小程序配置项',
  })
  @Post('create')
  async create(@Body() createDto: ThirdMiniProgramConfigDto) {
    const config: ThirdMiniProgramConfig =
      await this.thirdMiniProgramConfigService.createOrUpdate(createDto);

    // 同步第三方小程序商户
    const { status, data }: any = await request({
      url: config.interface,
      option: config.config,
    });

    if (data.success) {
      await this.thirdMiniProgramConfigService.createOrUpdate({
        ...createDto,
        status: status === 200 && data.success ? 1 : 2,
      });
      if (data.data) {
        const results: ThirdMiniProgram[] = data.data.map((re) => {
          return {
            id: re.id,
            projectId: createDto.projectId,
            name: re.name,
            desc: re.desc,
            environment: createDto.environment,
            bizConfig: JSON.stringify(re.ext),
          };
        });
        await this.thirdMiniProgramService.createOrUpdate(results);
      }
    }

    return config;
  }
}
