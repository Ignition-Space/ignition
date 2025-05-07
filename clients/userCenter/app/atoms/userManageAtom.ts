'use client';

import { atom } from 'jotai';
import type { UserData } from '../../lib/services/userService';

export interface UserManageState {
  userList: UserData[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  total: number;
  searchKeyword: string;
}

// 初始状态
const initialUserManageState: UserManageState = {
  userList: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  searchKeyword: '',
};

// 主用户管理状态原子
export const userManageAtom = atom<UserManageState>(initialUserManageState);

// 派生的只读 atoms
export const userListAtom = atom((get) => get(userManageAtom).userList);

export const userLoadingAtom = atom((get) => get(userManageAtom).loading);

export const userErrorAtom = atom((get) => get(userManageAtom).error);

export const searchKeywordAtom = atom(
  (get) => get(userManageAtom).searchKeyword,
);

export const userPaginationAtom = atom((get) => ({
  current: get(userManageAtom).currentPage,
  pageSize: get(userManageAtom).pageSize,
  total: get(userManageAtom).total,
}));
