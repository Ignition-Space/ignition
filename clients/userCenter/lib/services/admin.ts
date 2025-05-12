'use client';

import {
  type UserData,
  getUserList,
  getUserProfile,
  createUser,
  updateUser,
  changeUserStatus,
  getUserRoles,
  getAllUserRoles,
  setUserRoles,
} from './userService';

import {
  type SystemData,
  getSystemList,
  createSystem,
  updateSystem,
  deleteSystem,
} from './systemService';

import {
  type RoleData,
  getRoleList,
  getRoleSystemTree,
  createRole,
  updateRole,
  deleteRole,
  getRolePrivileges,
  setRolePrivileges,
} from './roleService';

import {
  type PrivilegeData,
  getPrivilegeList,
  getAllPrivilegesBySystem,
  createPrivilege,
  updatePrivilege,
  deletePrivilege,
  changePrivilegeStatus,
} from './privilegeService';

import {
  type ResourceData,
  getResourceList,
  getResourcesBySystemId,
  createResource,
  updateResource,
  deleteResource,
} from './resourceService';

// 别名导出，兼容旧代码
export const addPrivilege = createPrivilege;
export const addResource = createResource;
export const addRole = createRole;
export const addAdminUser = createUser;
export const getAdminUserList = getUserList;
export const updateAdminUser = updateUser;
export const deleteAdminUser = changeUserStatus;

// 重新导出类型
export type { UserData };
export type { SystemData };
export type { RoleData };
export type { PrivilegeData };
export type { ResourceData };

// 重新导出函数
export {
  // 用户管理
  getUserList,
  getUserProfile,
  createUser,
  updateUser,
  changeUserStatus,
  getUserRoles,
  getAllUserRoles,
  setUserRoles,

  // 系统管理
  getSystemList,
  createSystem,
  updateSystem,
  deleteSystem,

  // 角色管理
  getRoleList,
  getRoleSystemTree,
  createRole,
  updateRole,
  deleteRole,
  getRolePrivileges,
  setRolePrivileges,

  // 权限管理
  getPrivilegeList,
  getAllPrivilegesBySystem,
  createPrivilege,
  updatePrivilege,
  deletePrivilege,
  changePrivilegeStatus,

  // 资源管理
  getResourceList,
  getResourcesBySystemId,
  createResource,
  updateResource,
  deleteResource,
};
