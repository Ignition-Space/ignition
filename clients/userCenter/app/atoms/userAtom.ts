'use client';

import { atom } from 'jotai';

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  status: number;
  roles?: string[];
  permissions?: string[];
}

export interface UserState {
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// 初始状态
const initialUserState: UserState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// 主用户状态原子
export const userAtom = atom<UserState>(initialUserState);

// 派生的只读 atoms
export const userLoadingAtom = atom((get) => get(userAtom).loading);
export const userErrorAtom = atom((get) => get(userAtom).error);
export const currentUserAtom = atom((get) => get(userAtom).user);
export const isAuthenticatedAtom = atom((get) => get(userAtom).isAuthenticated);

// 检查是否已登录的原子
export const checkAuthAtom = atom(
  (get) => get(userAtom).isAuthenticated,
  (get, set) => {
    const token =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('token')
        : null;
    set(userAtom, {
      ...get(userAtom),
      isAuthenticated: !!token,
    });
  },
);
