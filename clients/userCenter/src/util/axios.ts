/*
 * @Author: ningyongheng ningyongheng@jeejio.com
 * @Date: 2024-05-10 19:50:47
 * @LastEditors: ningyongheng ningyongheng@jeejio.com
 * @LastEditTime: 2024-05-10 20:47:52
 * @FilePath: /fast-gateway-web/clients/userCenter/src/util/axios.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** 对axios做一些配置 **/

import axios from 'axios';
import { message } from 'antd';

// 默认基础请求地址
axios.defaults.baseURL = '/api';
// 请求是否带上cookie
axios.defaults.withCredentials = false;
// 对返回的结果做处理
axios.interceptors.response.use((response) => {
  const success = response?.data?.success;
  console.log(response?.data);
  // TODO:权限隐藏部分：
  return response.data;
  // 没有权限，登录超时，登出，跳转登录
  if (!success) {
    message.error('登录超时，请重新登录');
    sessionStorage.removeItem('userinfo');
    setTimeout(() => {
      window.location.href = '#/user/login';
    }, 1500);
  } else {
    return response.data;
  }
  return response.data;
});

export default axios;
