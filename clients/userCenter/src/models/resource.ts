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
     * 获取所有资源
     * **/
    async getResource(params): Promise<Res> {
      try {
        const res: Res = await axios.post('/resource/list/paginate', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
    /**
     * 添加资源
     * @param params ReourceParam
     */
    async addReource(params) {
      try {
        const res: Res = await axios.post('/resource/create', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
    /**
     * 修改资源
     * **/
    async upReource(params) {
      try {
        const res: Res = await axios.post('/resource/update', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
    /**
     * 修改资源
     * **/
    async delReource(params) {
      try {
        const res: Res = await axios.post('/resource/delete', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
    /**
     * 删除资源
     * **/
    async getReourcBySystemId(params: { systemId: number }) {
      try {
        const res: Res = await axios.post('/resource/listBySystemId', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
  }),
};
