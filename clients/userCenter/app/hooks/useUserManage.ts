'use client';

import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { userManageAtom } from '../atoms/userManageAtom';
import { getUserList } from '../../lib/services/userService';
import api from '../../lib/services/api';

interface UserResponse {
  list: any[];
  total: number;
}

export const useUserManage = () => {
  const [state, setState] = useAtom(userManageAtom);

  const fetchUserList = useCallback(
    async (page: number, pageSize: number, keyword: string = '') => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        const response = (await getUserList({
          keyword,
          page: {
            currentPage: page,
            pageSize,
          },
        })) as unknown as UserResponse;

        setState((prev) => ({
          ...prev,
          userList: response.list || [],
          total: response.total || 0,
          currentPage: page,
          pageSize,
          loading: false,
          error: null,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : '未知错误',
        }));
      }
    },
    [setState],
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        // 使用API删除用户
        await api.post('/user/delete', { id: parseInt(userId) });

        // 重新获取用户列表
        await fetchUserList(state.currentPage, state.pageSize);

        setState((prev) => ({
          ...prev,
          loading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : '未知错误',
        }));
        throw err;
      }
    },
    [setState, state.currentPage, state.pageSize, fetchUserList],
  );

  return {
    ...state,
    fetchUserList,
    deleteUser,
  };
};
