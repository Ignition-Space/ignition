'use client';

import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { userAtom, IUser } from '../atoms/userAtom';

// 模拟的用户信息
const mockUser: IUser = {
  id: '1',
  username: 'admin',
  name: '管理员',
  email: 'admin@example.com',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  roles: ['admin'],
  permissions: ['read', 'write', 'manage'],
  totalUsers: 70,
};

export function useUser() {
  const [userState, setUserState] = useAtom(userAtom);

  const fetchUserInfo = useCallback(async () => {
    setUserState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 在实际应用中，这里会调用后端API获取用户信息
      // const response = await userService.getUserInfo();
      // const userData = response.data;

      // 使用模拟数据
      setUserState((prev) => ({
        ...prev,
        loading: false,
        user: mockUser,
      }));

      return mockUser;
    } catch (error) {
      setUserState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '获取用户信息失败',
      }));
      throw error;
    }
  }, [setUserState]);

  const logout = useCallback(async () => {
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 清除用户信息
      setUserState((prev) => ({
        ...prev,
        user: null,
      }));

      // 清除本地存储的token
      localStorage.removeItem('token');
    } catch (error) {
      console.error('登出失败', error);
    }
  }, [setUserState]);

  return {
    user: userState.user,
    loading: userState.loading,
    error: userState.error,
    fetchUserInfo,
    logout,
  };
}
