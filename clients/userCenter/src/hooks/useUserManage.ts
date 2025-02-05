import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { userManageAtom } from '@/atoms/userManageAtom';
import { request } from '@/util/request';

export const useUserManage = () => {
  const [state, setState] = useAtom(userManageAtom);

  const fetchUserList = useCallback(
    async (page: number, pageSize: number) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await request({
          method: 'GET',
          prefix: '/api/user',
          url: 'list',
          query: { page, pageSize },
        });

        setState((prev) => ({
          ...prev,
          userList: response.data.list,
          total: response.data.total,
          currentPage: page,
          pageSize,
          loading: false,
          error: null,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        }));
      }
    },
    [setState],
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        await request({
          method: 'DELETE',
          prefix: '/api/user',
          url: `delete/${userId}`,
        });

        // 重新获取用户列表
        await fetchUserList(state.currentPage, state.pageSize);
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
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
