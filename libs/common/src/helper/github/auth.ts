
import { BASE_API_GITHUB_URL, BASE_GITHUB_URL, GITHUB_ID, GITHUB_SECRET } from './const';

import { methodV } from '../../utils/request';

/**
 * @description: 获取用户 token
 */
export const getGithubToken = async ({ code }) => {
  const { data } = await methodV({
    baseUrl: BASE_GITHUB_URL,
    url: `login/oauth/access_token`,
    method: 'POST',
    params: {
      client_id: GITHUB_ID,
      client_secret: GITHUB_SECRET,
      code,
    },
  });
  console.log('github===>', data)
  return data;
};

/**
 * @description: 获取 Github 用户
 */
export const getGithubUser = async ({ token }) => {
  const { data } = await methodV({
    baseUrl: BASE_API_GITHUB_URL,
    url: `user`,
    method: 'GET',
    headers: {
      Authorization: `token ${token}`,
    },
  });
  console.log(data)
  return data;
};
