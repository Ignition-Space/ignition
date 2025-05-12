'use client';

import { atom } from 'jotai';
import type { RoleData } from '../../lib/services/roleService';
import type { PrivilegeData } from '../../lib/services/privilegeService';
import type { ResourceData } from '../../lib/services/resourceService';
import type { UserData } from '../../lib/services/userService';

// 权限模态窗口状态
export interface PrivilegeModalState {
  visible: boolean;
  type: 'add' | 'edit';
  loading: boolean;
  currentItem: PrivilegeData | null;
}

// 权限管理状态
export interface PrivilegeState {
  list: PrivilegeData[];
  loading: boolean;
  error: string | null;
  searchKeyword: string;
  modal: PrivilegeModalState;
}

// 资源模态窗口状态
export interface ResourceModalState {
  visible: boolean;
  type: 'add' | 'edit';
  loading: boolean;
  currentItem: ResourceData | null;
}

// 资源管理状态
export interface ResourceState {
  list: ResourceData[];
  loading: boolean;
  error: string | null;
  searchKeyword: string;
  modal: ResourceModalState;
}

// 角色模态窗口状态
export interface RoleModalState {
  visible: boolean;
  type: 'add' | 'edit';
  loading: boolean;
  currentItem: RoleData | null;
}

// 角色管理状态
export interface RoleState {
  list: RoleData[];
  loading: boolean;
  error: string | null;
  searchKeyword: string;
  modal: RoleModalState;
}

// 管理员用户模态窗口状态
export interface AdminUserModalState {
  visible: boolean;
  type: 'add' | 'edit';
  loading: boolean;
  currentItem: UserData | null;
}

// 管理员用户状态
export interface AdminUserState {
  list: UserData[];
  loading: boolean;
  error: string | null;
  searchKeyword: string;
  modal: AdminUserModalState;
}

// 初始状态
// 权限管理初始状态
const initialPrivilegeState: PrivilegeState = {
  list: [],
  loading: false,
  error: null,
  searchKeyword: '',
  modal: {
    visible: false,
    type: 'add',
    loading: false,
    currentItem: null,
  },
};

// 资源管理初始状态
const initialResourceState: ResourceState = {
  list: [],
  loading: false,
  error: null,
  searchKeyword: '',
  modal: {
    visible: false,
    type: 'add',
    loading: false,
    currentItem: null,
  },
};

// 角色管理初始状态
const initialRoleState: RoleState = {
  list: [],
  loading: false,
  error: null,
  searchKeyword: '',
  modal: {
    visible: false,
    type: 'add',
    loading: false,
    currentItem: null,
  },
};

// 管理员用户初始状态
const initialAdminUserState: AdminUserState = {
  list: [],
  loading: false,
  error: null,
  searchKeyword: '',
  modal: {
    visible: false,
    type: 'add',
    loading: false,
    currentItem: null,
  },
};

// 主状态原子
export const privilegeAtom = atom<PrivilegeState>(initialPrivilegeState);
export const resourceAtom = atom<ResourceState>(initialResourceState);
export const roleAtom = atom<RoleState>(initialRoleState);
export const adminUserAtom = atom<AdminUserState>(initialAdminUserState);

// 派生的只读 atoms
// 权限派生原子
export const privilegeListAtom = atom((get) => get(privilegeAtom).list);
export const privilegeLoadingAtom = atom((get) => get(privilegeAtom).loading);
export const privilegeErrorAtom = atom((get) => get(privilegeAtom).error);
export const privilegeSearchKeywordAtom = atom(
  (get) => get(privilegeAtom).searchKeyword,
);
export const privilegeModalAtom = atom((get) => get(privilegeAtom).modal);

// 资源派生原子
export const resourceListAtom = atom((get) => get(resourceAtom).list);
export const resourceLoadingAtom = atom((get) => get(resourceAtom).loading);
export const resourceErrorAtom = atom((get) => get(resourceAtom).error);
export const resourceSearchKeywordAtom = atom(
  (get) => get(resourceAtom).searchKeyword,
);
export const resourceModalAtom = atom((get) => get(resourceAtom).modal);

// 角色派生原子
export const roleListAtom = atom((get) => get(roleAtom).list);
export const roleLoadingAtom = atom((get) => get(roleAtom).loading);
export const roleErrorAtom = atom((get) => get(roleAtom).error);
export const roleSearchKeywordAtom = atom((get) => get(roleAtom).searchKeyword);
export const roleModalAtom = atom((get) => get(roleAtom).modal);

// 管理员用户派生原子
export const adminUserListAtom = atom((get) => get(adminUserAtom).list);
export const adminUserLoadingAtom = atom((get) => get(adminUserAtom).loading);
export const adminUserErrorAtom = atom((get) => get(adminUserAtom).error);
export const adminUserSearchKeywordAtom = atom(
  (get) => get(adminUserAtom).searchKeyword,
);
export const adminUserModalAtom = atom((get) => get(adminUserAtom).modal);
