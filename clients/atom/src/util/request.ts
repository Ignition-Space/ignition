/*
 * @Author: Cookie
 * @Date: 2021-07-18 18:46:48
 * @LastEditors: Cookie
 * @LastEditTime: 2021-07-18 18:47:38
 * @Description:
 */

import qs from 'qs'
import axios from "axios";

interface IRequest {
  url: string
  params?: SVGForeignObjectElement
  query?: object
  header?: object
  method?: "POST" | "OPTIONS" | "GET" | "HEAD" | "PUT" | "DELETE" | undefined
}

interface IResponse {
  count: number
  errorMsg: string
  classify: string
  data: any
  detail?: any
  img?: object
}

export const request = ({ url, params, query, header, method = 'POST' }: IRequest): Promise<IResponse> => {
  return new Promise((resolve, reject) => {
    axios(query ? `${url}/?${qs.stringify(query)}` : url, {
      data: params,
      headers: header,
      method: method,
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
