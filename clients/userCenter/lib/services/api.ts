'use client';

import { message } from 'antd';
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
    const {
      success,
      msg,
      data,
      status,
      code,
      message: responseMessage,
    } = response.data;

    // 处理10002状态码（token失效）
    if (status === 10002 || code === 10002) {
      message.error('登录已过期，请重新登录');
      localStorage.removeItem('token');
      // 如果在浏览器环境，跳转到登录页
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(new Error('登录已过期，请重新登录'));
    }

    if (success) {
      return data;
    }

    // 处理业务错误
    if (!success) {
      message.error(msg || responseMessage || '请求失败');
      return Promise.reject({
        success,
        msg: msg || responseMessage,
        data,
      });
    }
  },
  (error) => {
    if (error.response) {
      // 获取响应数据
      const responseData = error.response.data;

      // 处理10002状态码（token失效）
      if (
        responseData?.status === 10002 ||
        responseData?.code === 10002 ||
        error.response.status === 10002
      ) {
        localStorage.removeItem('token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(new Error('登录已过期，请重新登录'));
      }

      // 处理401未授权（Token过期或无效）
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      // 提取错误信息
      const errorMessage =
        responseData?.message || responseData?.msg || '请求失败';
      return Promise.reject(new Error(errorMessage));
    }
    return Promise.reject(error);
  },
);

export default api;
