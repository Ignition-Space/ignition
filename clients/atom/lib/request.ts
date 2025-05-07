/*
 * @Author: Cookie
 * @Date: 2021-07-18 18:46:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-01-28 17:03:22
 * @Description:
 */

import qs from 'qs';
import axios from 'axios';

interface IRequest {
  prefix?: string;
  url: string;
  params?: any;
  query?: object;
  header?: object;
  method?: 'POST' | 'OPTIONS' | 'GET' | 'HEAD' | 'PUT' | 'DELETE' | undefined;
}

interface IResponse {
  count: number;
  errorMsg: string;
  classify: string;
  data: any;
  detail?: any;
  img?: object;
}

export const request = ({
  prefix = '',
  url,
  params,
  query,
  header,
  method = 'POST',
}: IRequest): Promise<IResponse> => {

  const reUrl = prefix + url;

  return new Promise((resolve, reject) => {
    axios(query ? `${reUrl}/?${qs.stringify(query)}` : reUrl, {
      data: params,
      headers: header,
      method: method,
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}; 