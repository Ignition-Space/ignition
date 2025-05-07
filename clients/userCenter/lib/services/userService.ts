'use client';

import api from './api';

// 用户相关数据类型
export interface UserData {
  id: number;
  username: string;
  email: string;
  status: number;
  createdAt: string;
}

export interface PaginationParams {
  pageSize: number;
  currentPage: number;
}

export interface UserListParams {
  keyword: string;
  page: PaginationParams;
}

export interface CreateUserParams {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserParams {
  id: number;
  username?: string;
  email?: string;
  status?: number;
}

export interface ChangeStatusParams {
  userId: number;
  status: number;
}

export interface UserRoleParams {
  userId: number;
  systemId: number;
}

export interface SetUserRolesParams {
  userId: number;
  bathRoles: string[];
}

// 获取用户列表（分页）
export async function getUserList(params: UserListParams) {
  return api.post('/user/list', params);
}

// 创建用户
export async function createUser(user: CreateUserParams) {
  return api.post('/user/create', user);
}

// 更新用户信息 - 现在API中没有这个接口，先保留
export async function updateUser(user: UpdateUserParams) {
  return api.post('/user/update', user);
}

// 更改用户状态（激活/禁用）
export async function changeUserStatus(params: ChangeStatusParams) {
  return api.post('/user/changeStatus', params);
}

// 获取当前用户信息
export async function getUserProfile() {
  return api.post('/user/profile');
}

// 获取用户特定系统角色
export async function getUserRoles(params: UserRoleParams) {
  return api.post('/user/getRolesById', params);
}

// 获取用户所有角色
export async function getAllUserRoles(userId: number) {
  return api.post('/user/getAllRolesById', { userId });
}

// 设置用户角色
export async function setUserRoles(params: SetUserRolesParams) {
  return api.post('/user/setRoles', params);
}
