import axios, {
  AxiosError,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import { getStorageItem, removeStorageItem } from './storage';
import { getEnv } from './index';
import { message } from 'antd';

// 根据不同环境使用不同的API baseURL
const rssAdminBaseURL = {
  dev: 'http://localhost:5000/api',
  test: 'https://api.rsstabs.com/rss/api',
  prod: 'https://api.rsstabs.com/rss/api',
};
const rssUserBaseURL = {
  dev: 'http://localhost:4000/api',
  test: 'https://api.rsstabs.com/user/api',
  prod: 'https://api.rsstabs.com/user/api',
};

// 创建axios实例
const service: AxiosInstance = axios.create({
  timeout: 30000,
});

// 获取认证头信息
const getHeaders = () => {
  const token = `Bearer ${getStorageItem('token')}`;
  return {
    Authorization: token,
  };
};

/* 响应拦截器 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { success, msg, data } = response.data;

    if (success) {
      return data;
    }

    // 处理业务错误
    if (!success) {
      message.error(msg);
      return Promise.reject({
        success,
        msg,
        data,
      });
    }
  },
  (error: AxiosError) => {
    // 处理 HTTP 网络错误
    let msg = '';
    // HTTP 状态码
    const status = error.response?.status;

    switch (status) {
      case 10002:
        msg = 'token 失效，请重新登录';
        // 这里可以触发退出的 action
        break;
      case 403:
        msg = '拒绝访问';
        break;
      case 404:
        msg = '请求地址错误';
        break;
      case 500:
        msg = '服务器故障';
        break;
      default:
        msg = '网络连接故障';
    }

    message.error(msg);

    if (status !== 204) {
      return Promise.reject(error);
    }
  },
);

/* 请求拦截器 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const headers = getHeaders();
    config.headers = {
      ...config.headers,
      ...headers,
    } as unknown as AxiosRequestHeaders;
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export interface Result<T = unknown> {
  code: number;
  message: string;
  data: T;
}

const getUrl = (url: string) => {
  if (url.startsWith('http')) {
    return url;
  }
  if (url.startsWith('user')) {
    return (
      rssUserBaseURL[getEnv() as 'dev' | 'test' | 'prod'] +
      url.replace('user', '')
    );
  }
  if (url.startsWith('rss')) {
    return (
      rssAdminBaseURL[getEnv() as 'dev' | 'test' | 'prod'] +
      url.replace('rss', '')
    );
  }
  return rssAdminBaseURL[getEnv() as 'dev' | 'test' | 'prod'] + url;
};

export default {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(getUrl(url), config);
  },
  post<T = unknown>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return service.post(getUrl(url), data, config);
  },
  upload<T = unknown>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', data as unknown as File);
    return service.post(getUrl(url), formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
  },
  put<T = unknown>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return service.put(getUrl(url), data, config);
  },
  patch<T = unknown>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return service.patch(getUrl(url), data, config);
  },
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(getUrl(url), config);
  },
};
