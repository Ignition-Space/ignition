import axios, { Method } from 'axios';

import { getConfig } from '@app/common';

const { FEISHU_CONFIG = {} } = getConfig();

const { FEISHU_URL } = FEISHU_CONFIG;

interface IMethodV {
  url: string;
  method?: Method;
  headers?: { [key: string]: string };
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
  const sendUrl = `${FEISHU_URL}${url}`;
  try {
    return new Promise<T>((resolve, reject) => {
      axios({
        url: sendUrl,
        method,
        params: query,
        headers: {
          'content-type': 'application/json',
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
    sendUrl = `${FEISHU_URL}${url}`;
  }
  console.log(sendUrl);
  try {
    return new Promise((resolve, reject) => {
      axios({
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          ...headers,
        },
        url: sendUrl,
        method,
        params: query,
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
