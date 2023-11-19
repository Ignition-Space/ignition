/**
 * 基础model,系统权限相关功能
 * 在src/store/index.js 中被挂载到store上，命名为 sys
 * **/

import axios from '@/util/axios'; // 自己写的工具函数，封装了请求数据的通用接口
import qs from 'qs';
import { message } from 'antd';
import { Dispatch } from '@/store';

import {
  Menu,
  PowerTree,
  SysState,
  Res,
  UserBasicInfoParam,
  SystemParam,
} from './index.type';

const defaultState: SysState = {
  menus: [], // 所有的菜单信息（用于菜单管理，无视权限）
  roles: [], // 所有的角色信息（用于Model赋予项，无视权限）
  powerTreeData: [], // 分配权限treeTable组件所需原始数据
};

export default {
  state: defaultState,
  reducers: {
    // 保存所有菜单数据
    reducerSetMenus(state: SysState, payload: Menu[]): SysState {
      return { ...state, menus: payload };
    },
    // 保存所有权限数据
    reducerSetAllPowers(state: SysState, payload: PowerTree[]): SysState {
      return { ...state, powerTreeData: payload };
    },
  },

  effects: (dispatch: Dispatch) => ({
    /**
     * 根据菜单ID获取对应的菜单信息
     * @param {number} id 可以是一个数字也可以是一个数组
     * **/
    async getMenusById(params: { id: number | number[] }) {
      try {
        const res: Res = await axios.post(`/getMenusById`, params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
    /**
     * 根据权限ID查询对应的权限数据
     * @param id 可以是一个数字也可以是一个数组
     * **/
    async getPowerById(params: { id: number | number[] }) {
      try {
        const res: Res = await axios.post(`/getPowerById`, params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
    /**
     * 分页查询角色数据
     * **/
    async getSysTem(params: { name?: string; status?: number }) {
      try {
        const res: Res = await axios.post(`/system/list`, params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },

    /**
     * 添加系统
     * **/
    async addSystem(params: SystemParam) {
      try {
        const res: Res = await axios.post('/system/create', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },

    /**
     * 修改系统
     * **/
    async upSystem(params: SystemParam) {
      try {
        const res: Res = await axios.post('/system/update', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
    /**
     * 删除系统
     * **/
    async delSystem(params: { id: number }) {
      return await axios.post('/system/delete', params);
    },

    /**
     * 通过角色ID查询该角色拥有的所有菜单和权限详细信息
     * **/
    async findAllPowerByRoleId(params: { id: number }) {
      try {
        const res: Res = await axios.get(
          `/findAllPowerByRoleId?${qs.stringify(params)}`,
        );
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },

    /**
     * 获取所有的菜单及权限详细信息
     * 如果你在sys.ts中引用了sys本身，则需要显式的注明返回值的类型
     * **/
    async getAllMenusAndPowers(): Promise<Res> {
      try {
        const res: Res = await axios.post(`/role/list`);
        if (res && res.status === 200) {
          dispatch.sys.reducerSetAllPowers(res.data);
        }
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },

    /**
     * 通过角色ID给指定角色设置菜单及权限
     * **/
    async setPowersByRoleId(params: {
      id: number;
      menus: number[];
      powers: number[];
    }) {
      try {
        const res: Res = await axios.post('/setPowersByRoleId', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },

    /**
     * (批量)通过角色ID给指定角色设置菜单及权限
     * @param params [{id,menus,powers},...]
     * */
    async setPowersByRoleIds(
      params: {
        id: number;
        menus: number[];
        powers: number[];
      }[],
    ) {
      try {
        const res: Res = await axios.post('/setPowersByRoleIds', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },

    /**
     * 条件分页查询用户列表
     * **/
    async getUserList(params: {
      pageNum: number;
      pageSize: number;
      username?: string;
      status?: number;
    }) {
      try {
        const res: Res = await axios.post(`/user/list/pagination`, {
          page: {
            pageSize: params.pageSize,
            currentPage: params.pageNum,
          },
        });
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },

    /**
     * 添加用户
     * **/
    async addUser(params: UserBasicInfoParam) {
      try {
        const res: Res = await axios.post('/addUser', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },

    /**
     * 修改用户
     * **/
    async upUser(params: UserBasicInfoParam) {
      try {
        const res: Res = await axios.post('/upUser', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },

    /**
     * 删除用户
     * **/
    async delUser(params: { id: number }) {
      try {
        const res: Res = await axios.post('/delUser', params);
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
  }),
};
