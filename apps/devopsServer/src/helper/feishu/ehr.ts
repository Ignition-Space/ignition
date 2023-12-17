import { methodV } from './request';

export const getEmployees = async (app_token: string) => {
  const { data } = await methodV({
    url: `/ehr/v1/employees`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${app_token}`,
    },
  });
  return data;
};
