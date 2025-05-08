'use client';

import api from './api';

// 系统相关数据类型
export interface SystemData {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export interface CreateSystemParams {
  name: string;
  description: string;
}

export interface UpdateSystemParams {
  id: number;
  name: string;
  description: string;
}

export interface DeleteSystemParams {
  id: number;
}

// 获取系统列表
export async function getSystemList() {
  return api.post('/system/list');
}

// 创建系统
export async function createSystem(system: CreateSystemParams) {
  return api.post('/system/create', system);
}

// 更新系统信息
export async function updateSystem(system: UpdateSystemParams) {
  return api.post('/system/update', system);
}

// 删除系统
export async function deleteSystem(params: DeleteSystemParams) {
  return api.post('/system/delete', params);
}
