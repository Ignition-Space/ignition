/** 对axios做一些配置 **/

import { message } from 'antd';
import axios from 'axios';

// 默认基础请求地址
axios.defaults.baseURL = '/api';
// 请求是否带上cookie
axios.defaults.withCredentials = false;
// 对返回的结果做处理
axios.interceptors.response.use((response) => {
  const success = response?.data?.success;
  console.log(response?.data);
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
