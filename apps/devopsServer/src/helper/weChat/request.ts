import axios, { Method } from 'axios';

import { WEICHAT_URL } from './config';

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
const Post = async <T>({
  url,
  params = {},
  query = {},
  method = 'POST',
}: IMethodV) => {
  const sendUrl = `${WEICHAT_URL}${url}`;
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
          console.log('weichat,error==>', error);
          reject(error);
        });
    });
  } catch (error) {
    throw error;
  }
};

export { Post };
