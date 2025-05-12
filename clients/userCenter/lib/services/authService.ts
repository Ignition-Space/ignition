'use client';

import api from './api';

// 认证相关数据类型
export interface LoginParams {
  username: string;
  password: string;
}

export interface OAuthGithubParams {
  code: string;
}

export interface OAuthGoogleParams {
  code: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email?: string;
  status: number;
  roles?: string[];
  permissions?: string[];
}

// 登录认证
export async function login(params: LoginParams) {
  return api.post('/auth/login', params);
}

// 备用登录接口 - login2
export async function login2(params: LoginParams) {
  return api.post('/auth/login2', params);
}

// Github OAuth登录
export async function loginWithGithub(code: string) {
  return api.get(`/auth/oauth/github?code=${code}`);
}

// Google OAuth登录
export async function loginWithGoogle(code: string) {
  return api.get(`/auth/oauth/google?code=${code}`);
}

// 飞书OAuth登录
export async function loginWithFeishu() {
  return api.get('/auth/feishu/auth2');
}

// 登出
export async function logout() {
  return api.post('/auth/logout');
}

// 获取Token信息
export async function getTokenInfo() {
  return api.get('/auth/token/info');
}

// 检查用户是否已登录
export function isAuthenticated() {
  if (typeof window === 'undefined') {
    return false; // 在服务器端始终返回未认证
  }
  const token = localStorage.getItem('token');
  return !!token; // 如果token存在则返回true
}
