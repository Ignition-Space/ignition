import { methodV } from './request';

export const batchGetUserIdByEmail = async (
  emails: string[],
  app_token: string,
) => {
  const { data } = await methodV({
    url: `/user/v1/batch_get_id?${emails
      .map((email) => 'emails=' + email)
      .join('&')}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${app_token}`,
    },
  });
  return data?.data?.email_users;
};

export const getUserIdByEmail = async (
  email: string,
  app_token: string,
): Promise<{ open_id: string; user_id: string } | undefined> => {
  const emailUsers = await batchGetUserIdByEmail([email], app_token);
  return emailUsers?.[email]?.[0];
};

export const getUserInfo = async (user_token: string) => {
  const { data } = await methodV({
    url: `/authen/v1/user_info`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${user_token}`,
    },
  });
  return data;
};

/**
 * 获取通信录单个用户信息
 * @param feishuUserId
 * @param user_token
 * @returns
 */
export const getSingleUserInfo = async (
  feishuUserId: string,
  token: string,
) => {
  const { data } = await methodV({
    url: `/contact/v3/users/${feishuUserId}`,
    method: 'GET',
    query: {
      user_id_type: 'user_id',
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

/**
 * 获取用户列表
 * @param app_token
 * @returns
 */
export const getUserList = async (app_token: string) => {
  const { data } = await methodV({
    url: `/contact/v3/users`,
    method: 'GET',
    query: {
      page_size: 100,
    },
    headers: {
      Authorization: `Bearer ${app_token}`,
    },
  });
  return data;
};

export const getEmployeeTypeEnums = async ({ app_token }) => {
  const { data } = await methodV({
    url: `/contact/v3/employee_type_enums`,
    method: 'GET',
    query: {
      page_token: 1,
      page_size: 100,
    },
    headers: {
      Authorization: `Bearer ${app_token}`,
    },
  });
  return data;
};
