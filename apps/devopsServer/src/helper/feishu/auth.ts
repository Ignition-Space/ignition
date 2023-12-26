import { getConfig } from '@app/common';
import { methodV } from './request';

const { FEISHU_CONFIG = {} } = getConfig();
const { FEISHU_APP_ID, FEISHU_APP_SECRET } = FEISHU_CONFIG;

export type GetAppTokenRes = {
  code: number;
  msg: string;
  app_access_token: string;
  expire: number;
};

export const getUserToken = async ({ code, app_token }) => {
  const { data } = await methodV({
    url: `/authen/v1/access_token`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${app_token}`,
    },
    params: {
      grant_type: 'authorization_code',
      code,
    },
  });
  return data;
};

export const refreshUserToken = async ({ refreshToken, app_token }) => {
  const { data } = await methodV({
    url: `/authen/v1/refresh_access_token`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${app_token}`,
    },
    params: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      app_token,
    },
  });
  return data;
};

export const getAppToken = async () => {
  const { data } = await methodV({
    url: `/auth/v3/app_access_token/internal`,
    method: 'POST',
    params: {
      FEISHU_APP_ID: FEISHU_APP_ID,
      FEISHU_APP_SECRET: FEISHU_APP_SECRET,
    },
  });
  return data as GetAppTokenRes;
};
