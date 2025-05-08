'use client';

import api from './api';

// 权限相关数据类型
export interface PrivilegeData {
  id: number;
  name: string;
  description: string;
  systemId: number;
  resourceKey: string;
  action: 'manage' | 'create' | 'read' | 'update' | 'delete';
  status: number;
  createdAt: string;
}

export interface PaginationParams {
  pageSize: number;
  currentPage: number;
}

export interface PrivilegeListParams {
  keyword: string;
  page: PaginationParams;
}

export interface CreatePrivilegeParams {
  name: string;
  description: string;
  systemId: number;
  resourceKey: string;
  action: 'manage' | 'create' | 'read' | 'update' | 'delete';
}

export interface UpdatePrivilegeParams {
  id: number;
  name: string;
  description: string;
  systemId: number;
  resourceKey: string;
  action: 'manage' | 'create' | 'read' | 'update' | 'delete';
}

export interface DeletePrivilegeParams {
  privilegeId: number;
}

export interface ChangePrivilegeStatusParams {
  privilegeId: number;
  status: 0 | 1 | 2; // 0-禁用 1-启用 2-其他状态
}

export interface ListAllPrivilegeParams {
  systemId: number;
}

// 获取权限列表（分页）
export async function getPrivilegeList(params: PrivilegeListParams) {
  return api.post('/privilege/list', params);
}

// 创建权限
export async function createPrivilege(privilege: CreatePrivilegeParams) {
  return api.post('/privilege/create', privilege);
}

// 更新权限
export async function updatePrivilege(privilege: UpdatePrivilegeParams) {
  return api.post('/privilege/update', privilege);
}

// 删除权限
export async function deletePrivilege(params: DeletePrivilegeParams) {
  return api.post('/privilege/delete', params);
}

// 更改权限状态
export async function changePrivilegeStatus(
  params: ChangePrivilegeStatusParams,
) {
  return api.post('/privilege/changeStatus', params);
}

// 获取系统所有权限
export async function getAllPrivilegesBySystem(params: ListAllPrivilegeParams) {
  return api.post('/privilege/listBySys', params);
}
