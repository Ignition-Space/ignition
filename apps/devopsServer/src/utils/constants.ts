import { ProcessNodes } from '@devopsServer/iteration/process/process.entity';

export const MAX_PAGE_SIZE = 100;

export const defaultPaginationParams: PaginationParams = {
  currentPage: 1,
  pageSize: 10,
};

export type Template = {
  env: ProcessNodes;
  type?: 'dev' | 'test' | 'fix' | 'prod' | 'fix';
  desc: string;
  name?:
  | 'devCurrentTask'
  | 'testCurrentTask'
  | 'fixCurrentTask'
  | 'prodCurrentTask';
};

export const PROCESS_NODE: { [projectType: string]: Template[] } = {
  web: [
    {
      env: ProcessNodes.development,
      type: 'dev',
      desc: '开发环境',
      name: 'devCurrentTask',
    },
    {
      env: ProcessNodes.testing,
      type: 'test',
      desc: '测试环境',
      name: 'testCurrentTask',
    },
    {
      env: ProcessNodes.fix,
      type: 'fix',
      desc: '预发环境',
      name: 'fixCurrentTask',
    },
    {
      env: ProcessNodes.production,
      type: 'prod',
      desc: '生产环境',
      name: 'prodCurrentTask',
    },
  ],
  weapp: [
    {
      env: ProcessNodes.development,
      type: 'dev',
      desc: '开发环境',
      name: 'devCurrentTask',
    },
    {
      env: ProcessNodes.testing,
      type: 'test',
      desc: '测试环境',
      name: 'testCurrentTask',
    },
    {
      env: ProcessNodes.fix,
      type: 'fix',
      desc: '预发环境',
      name: 'fixCurrentTask',
    },
    {
      env: ProcessNodes.production,
      type: 'prod',
      desc: '生产环境',
      name: 'prodCurrentTask',
    },
  ],
  gateway: [
    {
      env: ProcessNodes.development,
      type: 'dev',
      desc: '开发环境',
      name: 'devCurrentTask',
    },
    {
      env: ProcessNodes.testing,
      type: 'test',
      desc: '测试环境',
      name: 'testCurrentTask',
    },
    {
      env: ProcessNodes.fix,
      type: 'fix',
      desc: '预发环境',
      name: 'fixCurrentTask',
    },
    {
      env: ProcessNodes.production,
      type: 'prod',
      desc: '生产环境',
      name: 'prodCurrentTask',
    },
  ],
  weapp3rd: [
    {
      env: ProcessNodes.development,
      type: 'dev',
      desc: '开发环境',
      name: 'devCurrentTask',
    },
    {
      env: ProcessNodes.testing,
      type: 'test',
      desc: '测试环境',
      name: 'testCurrentTask',
    },
    {
      env: ProcessNodes.fix,
      type: 'fix',
      desc: '预发环境',
      name: 'fixCurrentTask',
    },
    {
      env: ProcessNodes.production,
      type: 'prod',
      desc: '生产环境',
      name: 'prodCurrentTask',
    },
  ],
  iOS: [
    {
      env: ProcessNodes.testing,
      type: 'test',
      desc: '测试环境',
      name: 'testCurrentTask',
    },
    {
      env: ProcessNodes.production,
      type: 'prod',
      desc: '生产环境',
      name: 'prodCurrentTask',
    },
  ],
  nodejs: [
    {
      env: ProcessNodes.testing,
      type: 'test',
      desc: '测试环境',
      name: 'testCurrentTask',
    },
    {
      env: ProcessNodes.production,
      type: 'prod',
      desc: '生产环境',
      name: 'prodCurrentTask',
    },
  ],
  android: [
    {
      env: ProcessNodes.testing,
      type: 'test',
      desc: '测试环境',
      name: 'testCurrentTask',
    },
    {
      env: ProcessNodes.production,
      type: 'prod',
      desc: '生产环境',
      name: 'prodCurrentTask',
    },
  ],
  rn: [
    {
      env: ProcessNodes.testing,
      type: 'test',
      desc: '测试环境',
      name: 'testCurrentTask',
    },
    {
      env: ProcessNodes.production,
      type: 'prod',
      desc: '生产环境',
      name: 'prodCurrentTask',
    },
  ],
};
