import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { JenkinsService } from './jenkins.service';
import {
  H5JenkinsParams,
  IJenkinsParams,
  IGetJenkinsInfoParams,
  IJenkinsMParams,
} from './jenkins.dto';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload as MicroPayload } from '@nestjs/microservices';
import { Public, CustomRpcExceptionFilter } from '@app/common';

const JENKINS_MAP = {};

@ApiTags('构建')
@Controller('jenkins')
export class JenkinsController {
  constructor(private readonly jenkinsService: JenkinsService) { }

  @Post('buildH5')
  async buildH5(
    @Body() jenkinsParams: IJenkinsParams<H5JenkinsParams>,
  ): Promise<string> {
    const { data } = await this.jenkinsService.buildH5(jenkinsParams);
    return data;
  }

  @Post('getJenkinsInfo')
  @Public()
  async getJenkinsInfo(
    @Body() getJenkinsInfoParams: IGetJenkinsInfoParams,
  ): Promise<string> {
    const { data } =
      await this.jenkinsService.getJenkinsInfo(getJenkinsInfoParams);
    return data;
  }

  /** 微前端 RPC 调用  */
  @Public()
  @UseFilters(new CustomRpcExceptionFilter())
  @MessagePattern('devops.jenkins.buildH5')
  async microBuildH5(@MicroPayload() data: IJenkinsMParams<H5JenkinsParams>) {
    const { type, params } = data;
    return this.buildH5({
      type: type,
      job: JENKINS_MAP[type].replace('devops-', ''),
      params,
    });
  }
}
