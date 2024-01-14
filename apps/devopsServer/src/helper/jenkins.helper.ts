import * as jenkins from 'jenkins';

import {
  IJenkinsType,
  IJenkinsParams,
  IJenkinsCallBack,
  IGetJenkinsInfoParams,
} from '../common/jenkins/jenkins.dto';

/**
 * @description: Jenkins连接
 */
const getJenkins = function (type: IJenkinsType) {
  const jenkinsConfig: any = {
    web: {
      baseUrl: 'http://root:12345@127.0.0.1:8080/',
      crumbIssuer: true,
    },
    gateway: {
      baseUrl: 'http://root:12345@127.0.0.1:8080/',
      crumbIssuer: true,
    },
    rn: {
      baseUrl: 'http://root:12345@127.0.0.1:8080/',
      crumbIssuer: true,
    },
    nodejs: {
      baseUrl: 'http://root:12345@127.0.0.1:8080/',
      crumbIssuer: true,
    },
    weapp3rd: {
      baseUrl: 'http://root:12345@127.0.0.1:8080/',
      crumbIssuer: true,
    },
    iOS: {
      baseUrl: 'http://root:12345@127.0.0.1:8080/',
      crumbIssuer: true,
    },
    android: {
      baseUrl: 'http://root:12345@127.0.0.1:8080/',
      crumbIssuer: true,
    },
    npm: {
      baseUrl: 'http://root:12345@127.0.0.1:8080/',
      crumbIssuer: true,
    },
    cdn: {
      baseUrl: 'http://root:12345@127.0.0.1:8080/',
      crumbIssuer: true,
    },
    cnpm: {
      baseUrl: 'http://root:12345@127.0.0.1:8080/',
      crumbIssuer: true,
    },
  };

  return jenkins(jenkinsConfig[type]);
};

/**
 * @description: 触发jenkins流水线
 * @param {*} param1
 * @return {*}
 */
const buildJenkins = async <T, REQT>({
  type,
  job,
  params,
}: IJenkinsParams<T>): Promise<IJenkinsCallBack<REQT>> => {
  const jenkinsCallback: any = await new Promise<any>((resolve, reject) => {
    getJenkins(type).job.build(
      { name: job, parameters: params },
      (err: any, data: any) => {
        if (err) {
          console.log('err: ', err);
          reject(err);
          return;
        }
        resolve({ queueId: data });
      },
    );
  });
  return { data: jenkinsCallback };
};

/**
 * @description: 获取当前节点信息
 * @return {*}
 */
const getQueuedInfo = async <REQT>({
  type,
  queueId,
}: IGetJenkinsInfoParams): Promise<IJenkinsCallBack<REQT>> => {
  const jenkinsCallback: any = await new Promise((resolve, reject) => {
    getJenkins(type).queue.item(queueId, (err: any, data: any) => {
      if (err) {
        console.log('err: ', err);
        reject(err);
        return;
      }
      resolve(data);
    });
  });
  return { data: jenkinsCallback };
};

/**
 * @description: 获取当前构建信息
 * @return {*}
 */
const getJenkinsInfo = async ({ type, job, buildNumber }) => {
  const jenkinsCallback: any = await new Promise((resolve, reject) => {
    getJenkins(type).build.get(job, buildNumber, (err: any, data: any) => {
      if (err) {
        console.log('err: ', err);
        reject(err);
        return;
      }
      resolve(data);
    });
  });
  const { statusCode } = jenkinsCallback;
  if (jenkinsCallback && statusCode !== 404) {
    return { data: jenkinsCallback };
  } else {
    return { data: jenkinsCallback };
  }
};

/**
 * @description: 获取jenkins打印
 * @param {*}
 * @return {*}
 */
const getJenkinsConsole = async ({ type, job, buildId }) => {
  const jenkinsCallback: any = await new Promise((resolve, reject) => {
    getJenkins(type).build.log(job, buildId, (err: any, data: any) => {
      if (err) {
        console.log('err: ', err);
        reject(err);
        return;
      }
      resolve(data);
    });
  });
  return { data: jenkinsCallback };
};

export { buildJenkins, getQueuedInfo, getJenkinsInfo, getJenkinsConsole };
