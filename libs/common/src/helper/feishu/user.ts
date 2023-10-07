import { methodV } from '../../utils/request';

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
export const getUserListByDepartmentId = async (department_id: string, app_token: string) => {
  const { data } = await methodV({
    url: `https://open.feishu.cn/open-apis/contact/v3/users`,
    // url: `/contact/v3/users/find_by_department`,
    method: 'GET',
    query: {
      department_id_type: 'department_id',
      department_id,
      page_size: 50,
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
