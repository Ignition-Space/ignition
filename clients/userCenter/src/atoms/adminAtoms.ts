import { atom } from 'jotai';
import type {
  PrivilegeState,
  ResourceState,
  RoleState,
  AdminUserState,
} from '@/types/admin';

const createInitialState = <T>(): AdminState<T> => ({
  list: [],
  loading: false,
  error: null,
  searchInfo: {
    name: undefined,
    status: undefined,
  },
  modal: {
    visible: false,
    type: 'add',
    loading: false,
    currentItem: null,
  },
});

// 权限管理状态
export const privilegeAtom = atom<PrivilegeState>(createInitialState());

// 资源管理状态
export const resourceAtom = atom<ResourceState>(createInitialState());

// 角色管理状态
export const roleAtom = atom<RoleState>(createInitialState());

// 用户管理状态
export const adminUserAtom = atom<AdminUserState>(createInitialState());
