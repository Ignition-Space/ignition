'use client';

import { atom } from 'jotai';
import type {
  PrivilegeState,
  ResourceState,
  RoleState,
  AdminUserState,
  Privilege,
  Resource,
  Role,
  AdminUser,
} from '../../lib/types/admin';

// 权限管理状态
export const privilegeAtom = atom<PrivilegeState>({
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
    currentItem: null as Privilege | null,
  },
});

// 资源管理状态
export const resourceAtom = atom<ResourceState>({
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
    currentItem: null as Resource | null,
  },
});

// 角色管理状态
export const roleAtom = atom<RoleState>({
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
    currentItem: null as Role | null,
  },
});

// 用户管理状态
export const adminUserAtom = atom<AdminUserState>({
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
    currentItem: null as AdminUser | null,
  },
});
