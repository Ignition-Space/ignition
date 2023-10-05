import axios from '@/util/axios'; // 自己写的工具函数，封装了请求数据的通用接口
import qs from 'qs';
import { message } from 'antd';
import { Dispatch } from '@/store';

import { Role, RoleParam, SysState, Res } from './index.type';

export default {
  state: {},
  reducers: {},
  effects: (dispatch: Dispatch) => ({
    /**
     * 查询所有权限
     * **/
    async getPrivilege(params) {
      try {
        const res: Res = await axios.post(`/privilege/list/pagination`, params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
    /**
     * 添加权限
     * **/
    async addPrivilege(params) {
      try {
        const res: Res = await axios.post('/privilege/create', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },

    /**
     * 修改权限
     * **/
    async upPrivilege(params) {
      try {
        const res: Res = await axios.post('/privilege/update', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },

    /**
     * 删除权限
     * **/
    async delPrivilege(params: { id: number }) {
      try {
        const res: Res = await axios.post('/privilege/delete', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
  }),
};
