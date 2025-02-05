// 权限管理相关类型
export interface Privilege {
  id: number;
  name: string;
  code: string;
  description: string;
  status: number;
  createTime: string;
  updateTime: string;
}

// 资源管理相关类型
export interface Resource {
  id: number;
  name: string;
  path: string;
  icon?: string;
  parentId: number;
  type: number;
  sort: number;
  status: number;
  createTime: string;
  updateTime: string;
}

// 角色管理相关类型
export interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  status: number;
  privileges: number[];
  createTime: string;
  updateTime: string;
}

// 用户管理相关类型
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  phone?: string;
  status: number;
  roles: number[];
  createTime: string;
  updateTime: string;
}

// 通用状态类型
export interface AdminState<T> {
  list: T[];
  loading: boolean;
  error: string | null;
  searchInfo: {
    name?: string;
    status?: number;
  };
  modal: {
    visible: boolean;
    type: 'add' | 'edit' | 'view';
    loading: boolean;
    currentItem: T | null;
  };
}

export type PrivilegeState = AdminState<Privilege>;
export type ResourceState = AdminState<Resource>;
export type RoleState = AdminState<Role>;
export type AdminUserState = AdminState<AdminUser>;
