import { methodV } from './request';

/**
 * 获取子部门列表
 * @param app_token
 * @returns
 */
export const getDepartments = async (app_token: string) => {
  const { data } = await methodV({
    url: `/contact/v3/departments/c2d10/children`,
    method: 'GET',
    query: {
      department_id_type: 'department_id',
      fetch_child: true,
    },
    headers: {
      Authorization: `Bearer ${app_token}`,
    },
  });
  return data;
};

/**
 * 搜索部门
 * @param app_token
 * @returns
 */
export const searchDepartment = async (app_token: string) => {
  const { data } = await methodV({
    url: `/contact/v3/departments/search`,
    method: 'POST',
    params: {
      query: '产研',
    },
    headers: {
      Authorization: `Bearer ${app_token}`,
    },
  });
  return data;
};

export const getParentDepartments = async (token: string) => {
  const { data } = await methodV({
    url: `/contact/v3/departments/parent`,
    method: 'GET',
    query: {
      department_id: 'od-b08c0cba61b5c35def85e4eff16118b3',
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
