'use client';

import { atom } from 'jotai';
import type { IUser } from '../../lib/services/user';

export interface UserManageState {
  userList: IUser[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  total: number;
}

export const userManageAtom = atom<UserManageState>({
  userList: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

export const userListAtom = atom((get) => get(userManageAtom).userList);

export const userPaginationAtom = atom((get) => ({
  current: get(userManageAtom).currentPage,
  pageSize: get(userManageAtom).pageSize,
  total: get(userManageAtom).total,
}));
