import request from '@/util/request';
import type { RoleData } from '@/atoms/roleAtom';

const prefix = '/api/role';

export const getAllRoles = () => {
  return request.get<RoleData[]>(`${prefix}/all`);
};

export const getAllRolesById = (userId: number) => {
  return request.get<RoleData[]>(`${prefix}/user/${userId}`);
};

export const setUserRoles = (params: {
  userId: number;
  bathRoles: { systemId: number }[];
}) => {
  return request.post(`${prefix}/user/set`, params);
};
