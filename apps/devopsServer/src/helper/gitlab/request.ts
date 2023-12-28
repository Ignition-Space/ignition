/*
 * @Author: Cookie
 * @Description: gitLab request 模块
 */
import axios, { Method } from 'axios';

import { getConfig } from '@app/common';

const { GITLAB_CONFIG = {} } = getConfig();
const { ADMIN_PRIVATE_TOKEN, GIT_URL } = GITLAB_CONFIG;

interface IMethodV {
  url: string;
  method?: Method;
  headers?: any;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
}

export interface IRequest {
  data: any;
  code: number;
}

/**
 * @author: Cookie
 * @description: 不带 version 的 api 请求
 */
const gitPost = async <T>({
  url,
  params = {},
  query = {},
  method = 'POST',
}: IMethodV) => {
  const sendUrl = `${GIT_URL}${url}`;
  try {
    return new Promise<T>((resolve, reject) => {
      axios({
        url: sendUrl,
        method,
        params: {
          'private-token': ADMIN_PRIVATE_TOKEN,
          ...query,
        },
        headers: {
          'content-type': 'application/json',
          'PRIVATE-TOKEN': ADMIN_PRIVATE_TOKEN,
        },
        data: params,
      })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  } catch (error) {
    throw error;
  }
};

/**
 * @author: Cookie
 * @description: 带 version 的通用 api 请求
 */
const methodV = async ({
  url,
  method,
  headers,
  params = {},
  query = {},
}: IMethodV): Promise<IRequest> => {
  let sendUrl = '';
  if (/^(http:\/\/|https:\/\/)/.test(url)) {
    sendUrl = url;
  } else {
    sendUrl = `${GIT_URL}/api/v4${url}`;
  }
  console.log(sendUrl, query);
  try {
    return new Promise((resolve, reject) => {
      axios({
        headers: {
          'content-type': 'application/json',
          // 放开所有权限
          'PRIVATE-TOKEN': ADMIN_PRIVATE_TOKEN,
          ...headers,
        },
        url: sendUrl,
        method,
        params: {
          'private-token': ADMIN_PRIVATE_TOKEN,
          ...query,
        },
        data: {
          ...params,
        },
      })
        .then(({ data, status }) => {
          resolve({ data, code: status });
        })
        .catch((error) => {
          reject(error);
        });
    });
  } catch (error) {
    throw error;
  }
};

export { gitPost, methodV };
