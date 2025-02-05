import request from '@/util/request';
import type { Privilege, Resource, Role, AdminUser } from '@/types/admin';

const prefix = 'user';

// 权限管理接口
export const getPrivilegeList = (params?: {
  name?: string;
  status?: number;
}) => {
  return request.post<Privilege[]>(`${prefix}/privilege/list`, { params });
};

export const addPrivilege = (params: Omit<Privilege, 'id'>) => {
  return request.post<Privilege>(`${prefix}/privilege/add`, params);
};

export const updatePrivilege = (params: Privilege) => {
  return request.put<Privilege>(`${prefix}/privilege/update`, params);
};

export const deletePrivilege = (id: number) => {
  return request.delete(`${prefix}/privilege/delete/${id}`);
};

// 资源管理接口
export const getResourceList = (params?: {
  name?: string;
  status?: number;
}) => {
  return request.post<Resource[]>(`${prefix}/resource/list`, { params });
};

export const addResource = (params: Omit<Resource, 'id'>) => {
  return request.post<Resource>(`${prefix}/resource/add`, params);
};

export const updateResource = (params: Resource) => {
  return request.put<Resource>(`${prefix}/resource/update`, params);
};

export const deleteResource = (id: number) => {
  return request.delete(`${prefix}/resource/delete/${id}`);
};

// 角色管理接口
export const getRoleList = (params?: { name?: string; status?: number }) => {
  return request.post<Role[]>(`${prefix}/role/list`, { params });
};

export const addRole = (params: Omit<Role, 'id'>) => {
  return request.post<Role>(`${prefix}/role/create`, params);
};

export const updateRole = (params: Role) => {
  return request.put<Role>(`${prefix}/role/update`, params);
};

export const deleteRole = (id: number) => {
  return request.delete(`${prefix}/role/delete/${id}`);
};

// 用户管理接口
export const getAdminUserList = (params?: {
  username?: string;
  status?: number;
}) => {
  return request.post<AdminUser[]>(`${prefix}/user/list`, { params });
};

export const addAdminUser = (params: Omit<AdminUser, 'id'>) => {
  return request.post<AdminUser>(`${prefix}/user/create`, params);
};

export const updateAdminUser = (params: AdminUser) => {
  return request.put<AdminUser>(`${prefix}/user/update`, params);
};

export const deleteAdminUser = (id: number) => {
  return request.delete(`${prefix}/user/delete/${id}`);
};
