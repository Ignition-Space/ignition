'use client';

import api from './api';

// 角色相关数据类型
export interface RoleData {
  id: number;
  name: string;
  description: string;
  systemId: number;
  createdAt: string;
}

export interface PaginationParams {
  pageSize: number;
  currentPage: number;
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

export interface UpdateRoleParams {
  id: number;
  name: string;
  description: string;
  systemId: number;
}

export interface DeleteRoleParams {
  id: number;
}

export interface GetPrivilegesByRoleParams {
  roleId: number;
}

export interface SetRolePrivilegesParams {
  roleId: number;
  systemId: number;
  privileges?: number[]; // 根据API可能需要调整
}

// 获取角色列表（分页）
export async function getRoleList(params: RoleListParams) {
  return api.post('/role/list', params);
}

// 获取角色系统树
export async function getRoleSystemTree() {
  return api.post('/role/list/withSystem');
}

// 兼容旧代码
export const getRoleListWithSystem = getRoleSystemTree;

// 创建角色
export async function createRole(role: CreateRoleParams) {
  return api.post('/role/create', role);
}

// 更新角色
export async function updateRole(role: UpdateRoleParams) {
  return api.post('/role/update', role);
}

// 删除角色
export async function deleteRole(params: DeleteRoleParams) {
  return api.post('/role/delete', params);
}

// 获取角色权限
export async function getRolePrivileges(params: GetPrivilegesByRoleParams) {
  return api.post('/role/getPrivilegeListById', params);
}

// 兼容旧代码
export const getPrivilegesByRoleId = (roleId: number) =>
  getRolePrivileges({ roleId });

// 设置角色权限
export async function setRolePrivileges(params: SetRolePrivilegesParams) {
  return api.post('/role/set', params);
}
