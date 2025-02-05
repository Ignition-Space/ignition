import request from '@/util/request';
import type { SystemItem } from '@/types/system';

const prefix = 'user/system';

export const getSystemList = (params?: { name?: string; status?: number }) => {
  return request.post<SystemItem[]>(`${prefix}/list`, { params });
};

export const addSystem = (params: Omit<SystemItem, 'id'>) => {
  return request.post(`${prefix}/create`, params);
};

export const updateSystem = (params: SystemItem) => {
  return request.post(`${prefix}/update`, params);
};

export const deleteSystem = (id: number) => {
  return request.delete(`${prefix}/delete/${id}`);
};
