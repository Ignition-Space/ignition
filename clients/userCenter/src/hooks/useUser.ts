import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { userAtom } from '@/atoms/userAtom';
import { getUserInfo, updateUserInfo, login, logout } from '@/services/user';
import type { IUser } from '@/services/user';
import { removeStorageItem, setStorageItem } from '@/util/storage';

export const useUser = () => {
  const [userState, setUserState] = useAtom(userAtom);

  const setLoading = useCallback(
    (loading: boolean) => {
      setUserState((prev) => ({ ...prev, loading }));
    },
    [setUserState],
  );

  const setError = useCallback(
    (error: string | null) => {
      setUserState((prev) => ({ ...prev, error }));
    },
    [setUserState],
  );

  const fetchUserInfo = useCallback(async () => {
    setUserState((prev) => ({ ...prev, loading: true }));
    const response = await getUserInfo();
    setUserState((prev) => ({
      ...prev,
      user: response.data,
      error: null,
    }));
    setUserState((prev) => ({ ...prev, loading: false }));
  }, [setUserState]);

  const updateUser = useCallback(
    async (userData: Partial<IUser>) => {
      setLoading(true);
      const response = await updateUserInfo(userData);
      setUserState((prev) => ({
        ...prev,
        user: response.data,
        error: null,
      }));
      setLoading(false);
      return response;
    },
    [setLoading, setError, setUserState],
  );

  const loginUser = useCallback(
    async (username: string, password: string) => {
      setUserState((prev) => ({ ...prev, loading: true }));
      const token = await login({ username, password });
      setStorageItem('token', token);
      const userInfo = await getUserInfo();
      setUserState((prev) => ({
        ...prev,
        user: userInfo.data,
        loading: false,
      }));
    },
    [setUserState],
  );

  const logoutUser = useCallback(async () => {
    setUserState((prev) => ({ ...prev, loading: true }));
    await logout();
    removeStorageItem('token');
    setUserState((prev) => ({
      ...prev,
      user: null,
      error: null,
    }));
    setUserState((prev) => ({ ...prev, loading: false }));
  }, [setUserState]);

  return {
    ...userState,
    fetchUserInfo,
    updateUser,
    loginUser,
    logoutUser,
  };
};
