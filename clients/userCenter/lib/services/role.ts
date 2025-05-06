import request from '../utils/request';
import type { Role } from '../types/admin';

const prefix = '/api/role';

export const getAllRoles = () => {
  return request.get<Role[]>(`${prefix}/all`);
};

export const getAllRolesById = (userId: number) => {
  return request.get<Role[]>(`${prefix}/user/${userId}`);
};

export const setUserRoles = (params: {
  userId: number;
  bathRoles: { systemId: number }[];
}) => {
  return request.post(`${prefix}/user/set`, params);
};
