import axios from '@/util/axios'; // 自己写的工具函数，封装了请求数据的通用接口
import qs from 'qs';
import { message } from 'antd';
import { Dispatch } from '@/store';

import { Role, RoleParam, SysState, Res } from './index.type';

export default {
  state: {},
  reducers: {
    // 保存所有角色数据
    reducerSetRoles(state: SysState, payload: Role[]): SysState {
      return { ...state, roles: payload };
    },
  },
  effects: (dispatch: Dispatch) => ({
    /** 获取所有角色 **/
    async getAllRoles(): Promise<Res> {
      try {
        const res: Res = await axios.post('/role/list/withSystem');
        if (res && res.status === 200) {
          dispatch.role.reducerSetRoles(res.data);
        }
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
    /**
     * 分页查询角色数据
     * **/
    async getRoles(params: {
      pageNum: number;
      pageSize: number;
      name?: string;
      status?: number;
    }) {
      try {
        const res: Res = await axios.post(`/role/list/pagination`, params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
    /**
     * 通过角色ID查询对应的角色数据
     * @param id 可以是一个数字，也可以是一个数组
     * @return 返回值是数组
     * **/
    async getAllRolesById(params: { id: number | number[] }) {
      try {
        const res: Res = await axios.post(`/user/getAllRolesById`, params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
    /**
     * 添加角色
     * **/
    async addRole(params: RoleParam) {
      try {
        const res: Res = await axios.post('/role/create', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
    /**
     * 修改角色
     * **/
    async upRole(params: RoleParam) {
      try {
        const res: Res = await axios.post('/role/update', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
    /**
     * 删除角色
     * **/
    async delRole(params: { id: number }) {
      try {
        const res: Res = await axios.post('/role/delete', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
    /**
     * 给用户分配角色
     * **/
    async setUserRoles(params) {
      try {
        const res: Res = await axios.post('/user/setRoles', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
  }),
};
