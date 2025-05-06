'use client';

import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api' : '/api';

// 创建axios实例
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 处理401未授权（Token过期或无效）
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      // 提取错误信息
      const errorMessage = error.response.data?.message || '请求失败';
      return Promise.reject(new Error(errorMessage));
    }
    return Promise.reject(error);
  },
);

export default api;
