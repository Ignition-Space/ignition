'use client';

import api from './api';
import { PaginationParams } from './userService';

// 权限相关数据类型
export interface PrivilegeData {
  id: number;
  name: string;
  resourceKey: string;
  description: string;
  action: 'manage' | 'create' | 'read' | 'update' | 'delete';
  systemId: number;
  status: number;
}

export interface PrivilegeListParams {
  keyword: string;
  page: PaginationParams;
}

export interface CreatePrivilegeParams {
  name: string;
  resourceKey: string;
  description: string;
  action: 'manage' | 'create' | 'read' | 'update' | 'delete';
  systemId: number;
}

export interface UpdatePrivilegeParams extends CreatePrivilegeParams {
  id: number;
}

export interface ChangeStatusParams {
  privilegeId: number;
  status: number; // 0禁用 1启用 2删除
}

// 获取权限列表（分页）
export async function getPrivilegeList(params: PrivilegeListParams) {
  return api.post('/privilege/list', params);
}

// 根据系统ID获取所有权限
export async function getPrivilegesBySystemId(systemId: number) {
  return api.post('/privilege/listBySys', { systemId });
}

// 创建权限
export async function createPrivilege(privilege: CreatePrivilegeParams) {
  return api.post('/privilege/create', privilege);
}

// 更新权限
export async function updatePrivilege(privilege: UpdatePrivilegeParams) {
  return api.post('/privilege/update', privilege);
}

// 更改权限状态
export async function changePrivilegeStatus(params: ChangeStatusParams) {
  return api.post('/privilege/changeStatus', params);
}

// 删除权限
export async function deletePrivilege(privilegeId: number) {
  return api.post('/privilege/delete', { privilegeId });
}
