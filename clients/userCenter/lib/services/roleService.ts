'use client';

import api from './api';
import { PaginationParams } from './userService';

// 角色相关数据类型
export interface RoleData {
  id: number;
  name: string;
  description: string;
  systemId: number;
}

export interface RoleListParams {
  keyword: string;
  page: PaginationParams;
}

export interface CreateRoleParams {
  name: string;
  description: string;
  systemId: number;
}

export interface UpdateRoleParams extends CreateRoleParams {
  id: number;
}

// 获取角色列表（分页）
export async function getRoleList(params: RoleListParams) {
  return api.post('/role/list', params);
}

// 获取树形角色列表（系统级别）
export async function getRoleListWithSystem() {
  return api.post('/role/list/withSystem');
}

// 创建角色
export async function createRole(role: CreateRoleParams) {
  return api.post('/role/create', role);
}

// 更新角色
export async function updateRole(role: UpdateRoleParams) {
  return api.post('/role/update', role);
}

// 删除角色
export async function deleteRole(id: number) {
  return api.post('/role/delete', { id });
}

// 根据角色ID获取权限列表
export async function getPrivilegesByRoleId(roleId: number) {
  return api.post('/role/getPrivilegeListById', { roleId });
}

// 设置角色权限
export async function setRolePrivileges(
  roleId: number,
  systemId: number,
  privilegeIds: number[],
) {
  return api.post('/role/set', { roleId, systemId, privilegeIds });
}
