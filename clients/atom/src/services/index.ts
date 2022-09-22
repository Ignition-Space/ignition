import { request } from '@/util/request';

const prefix = 'http://localhost:3000/api/';

export interface ISite {
  id?: string;
  url: string;
  apiType: number;
  name: string;
  description: string;
  type: number;
}

export interface IProperty {
  name: string;
  type: string;
  example: string;
  description: string;
}

export interface IInterface {
  apiType: string;
  createDate: string;
  id: string;
  methodType: string;
  parameterType: string;
  schema: any;
  siteId: string;
  summary: string;
  tags: string[];
  updateDate: string;
  url: string;
}

export const getSiteList = () => {
  return request({
    prefix,
    url: 'site/getList',
  });
};

export const getSite = (id: string) => {
  return request({
    method: 'GET',
    prefix,
    url: `site/${id}`,
  });
};

export const analysisInterface = (siteId: string) => {
  return request({
    prefix,
    params: {
      id: siteId,
    },
    url: 'site/analysis',
  });
};

export const setSite = (params: ISite) => {
  return request({
    prefix,
    params,
    url: 'site/saveAndUpdate',
  });
};

export const getInterfaceList = (id: string) => {
  return request({
    method: 'GET',
    prefix,
    url: `interface/site/${id}`,
  });
};

interface IGeneraPage {
  path: string;
  siteId: string;
  interfaceId: string;
  name: string;
  templateId: string;
  type: number;
  device: number;
}

export const generatePage = (params: IGeneraPage) => {
  return request({
    prefix,
    params,
    url: 'page/save',
  });
};
