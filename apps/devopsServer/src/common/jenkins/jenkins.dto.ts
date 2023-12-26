export class H5JenkinsParams {
  DEPLOY_CONFIG: string;
  NACOS_CONFIG: string;
  PROJECT_GIT_PATH: string;
  PROJECT_NAME: string;
  PROJECT_VERSION: string;
  BRANCH_NAME: string;
  CACHE: boolean;
  PIPELINE_STEPS: string;
  GITLAB_URL?: string;
  PROJECT_ID: number;
  COMMITS_SHA: string;
  DEPLOY_ENV: string;
  DOCKER_PUBLISHER?: string;
  USER_EMAIL: string;
  NAMESPACE: string;
  TASK_ID: number;
  T_CONFIG?: string;
  WEAPP_KEY?: string;
  MP_APPID?: string;
  ARCHIVE_USER?: string;
  DESC?: string;
  CDN?: string;
  NPM?: string;
  RESOURCE?: string;
  EXTRA?: string; // 自由扩展字段
}

export type IJenkinsType =
  | 'web'
  | 'h5'
  | 'nodejs'
  | 'npm'
  | 'nodeProduct'
  | 'android'
  | 'java'
  | 'weapp3rd'
  | 'iOS'
  | 'cdn'
  | 'microfe'
  | 'gateway';

export class IGetJenkinsInfoParams {
  type: IJenkinsType;
  queueId: number;
}

export class IJenkinsParams<T> {
  type: IJenkinsType;
  job: string;
  params: T;
}

export class IJenkinsMParams<T> {
  type: IJenkinsType;
  params: T;
}

export class IJenkinsCallBack<T> {
  data: T;
}
