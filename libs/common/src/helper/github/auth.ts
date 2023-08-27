
import { BASE_GITHUB_URL, GITHUB_ID, GITHUB_SECRET } from './const';

import { methodV } from '../../utils/request';

export type GetAppTokenRes = {
  code: number;
  msg: string;
  app_access_token: string;
  expire: number;
};

/**
 * @description: 获取用户 token
 */
export const getUserToken = async ({ code }) => {
  const { data } = await methodV({
    baseUrl: BASE_GITHUB_URL,
    url: `/login/oauth/access_token`,
    method: 'POST',
    params: {
      client_id: GITHUB_ID,
      client_secret: GITHUB_SECRET,
      code,
    },
  });
  return data;
};
