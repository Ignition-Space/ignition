import { methodV } from '../../utils/request';
import { BASE_GITHUB_URL } from './const';

export const getUserInfo = async (user_token: string) => {
  const { data } = await methodV({
    baseUrl: BASE_GITHUB_URL,
    url: "user",
    method: 'GET',
    headers: {
      Authorization: `Bearer ${user_token}`,
    },
  });
  return data;
};
