'use client';

import api from './api';

// 资源相关数据类型
export interface ResourceData {
  id: number;
  name: string;
  key: string;
  type: 'menu' | 'nomal';
  parentId: number | null;
  systemId: number;
  description: string;
  createdAt: string;
}

export interface PaginationParams {
  pageSize: number;
  currentPage: number;
}

export interface ResourceListParams {
  keyword: string;
  page: PaginationParams;
}

export interface ListBySystemIdParams {
  systemId: number;
}

export interface CreateResourceParams {
  name: string;
  key: string;
  type: 'menu' | 'nomal';
  parentId: number | null;
  systemId: number;
  description: string;
}

export interface UpdateResourceParams {
  id: number;
  name: string;
  key: string;
  type: 'menu' | 'nomal';
  parentId: number | null;
  systemId: number;
  description: string;
}

export interface DeleteResourceParams {
  id: number;
}

// 获取资源列表（分页）
export async function getResourceList(params: ResourceListParams) {
  return api.post('/resource/list', params);
}

// 根据系统ID获取资源列表
export async function getResourcesBySystemId(params: ListBySystemIdParams) {
  return api.post('/resource/listBySystemId', params);
}

// 创建资源
export async function createResource(resource: CreateResourceParams) {
  return api.post('/resource/create', resource);
}

// 更新资源
export async function updateResource(resource: UpdateResourceParams) {
  return api.post('/resource/update', resource);
}

// 删除资源
export async function deleteResource(params: DeleteResourceParams) {
  return api.post('/resource/delete', params);
}
