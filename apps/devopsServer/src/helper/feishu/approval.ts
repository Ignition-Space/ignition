import { methodV } from './request';
import {
  CreateApprovalParams,
  GetApprovalDefinedParams,
  GetApprovalInstanceParams,
} from './type';

// 创建审批实例
export const createApproval = async (
  params: CreateApprovalParams,
  app_token: string,
) => {
  const { data } = await methodV({
    url: `https://www.feishu.cn/approval/openapi/v2/instance/create`,
    method: 'POST',
    params: { ...params },
    headers: {
      Authorization: `Bearer ${app_token}`,
    },
  });
  return data;
};
// 获取审批定义
export const getApprovalDefined = async (
  params: GetApprovalDefinedParams,
  app_token: string,
) => {
  const { data } = await methodV({
    url: `https://www.feishu.cn/approval/openapi/v2/approval/get`,
    method: 'POST',
    params: { ...params },
    headers: {
      Authorization: `Bearer ${app_token}`,
    },
  });
  return data;
};

// 获取审批实例
export const getApprovalInstance = async (
  params: GetApprovalInstanceParams,
  app_token: string,
) => {
  const { data } = await methodV({
    url: `https://www.feishu.cn/approval/openapi/v2/instance/get`,
    method: 'POST',
    params: { ...params },
    headers: {
      Authorization: `Bearer ${app_token}`,
    },
  });
  return data;
};
