'use client';

import api from './api';

export interface LoginParams {
  username: string;
  password: string;
}
export interface LoginResponse {
  data: string;
}

/**
 * 用户登录
 * @param params 登录参数
 * @returns 登录响应
 */
export async function login(params: LoginParams): Promise<LoginResponse> {
  try {
    // 我们的api返回的直接是响应体的data部分
    const data = await api.post('/auth/login', params);

    // data应该符合LoginResponse接口
    const response = data as unknown as LoginResponse;

    // 保存token到localStorage
    if (response && response.data) {
      localStorage.setItem('token', response.data);
    }

    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * 退出登录
 */
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // 即使API请求失败，也清除本地token
    console.error('登出API请求失败', error);
  } finally {
    localStorage.removeItem('token');
    // 如果在浏览器环境，跳转到登录页
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}

/**
 * 检查是否已登录
 * @returns 是否已登录
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const token = localStorage.getItem('token');
  return !!token;
}

/**
 * 获取当前用户信息
 * @returns 用户信息
 */
export async function getCurrentUser() {
  try {
    const response = await api.get('/auth/token/info');
    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * 获取token
 * @returns token字符串或null
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem('token');
}
