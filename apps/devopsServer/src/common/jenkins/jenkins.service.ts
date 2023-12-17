import { Injectable } from '@nestjs/common';
import {
  H5JenkinsParams,
  IJenkinsParams,
  IJenkinsCallBack,
  IGetJenkinsInfoParams,
} from './jenkins.dto';
import { buildJenkins, getQueuedInfo } from './jenkins.helper';

@Injectable()
export class JenkinsService {
  async buildH5(
    jenkinsParams: IJenkinsParams<H5JenkinsParams>,
  ): Promise<IJenkinsCallBack<any>> {
    const jenkinsCallback = await buildJenkins<
      H5JenkinsParams,
      IJenkinsCallBack<any>
    >({
      ...jenkinsParams,
    });
    return jenkinsCallback;
  }

  async getJenkinsInfo(
    getJenkinsInfoParams: IGetJenkinsInfoParams,
  ): Promise<IJenkinsCallBack<any>> {
    const jenkinsCallback =
      await getQueuedInfo<IJenkinsCallBack<any>>(getJenkinsInfoParams);
    return jenkinsCallback;
  }
}
