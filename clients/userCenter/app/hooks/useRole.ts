'use client';

import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { atom } from 'jotai';
import {
  getRoleList,
  getRoleListWithSystem,
  createRole,
  updateRole,
  deleteRole,
  getPrivilegesByRoleId,
  setRolePrivileges,
} from '../../lib/services/roleService';
import { message } from 'antd';

// 扩展角色接口以包含systemId
interface RoleWithSystem {
  id: number;
  systemId: number;
  name: string;
  code: string;
  description?: string;
}

// 定义角色状态
interface RoleStateType {
  roleData: RoleWithSystem[];
  roleTreeShow: boolean;
  roleTreeLoading: boolean;
  roleTreeDefault: string[];
}

export const roleState = atom<RoleStateType>({
  roleData: [],
  roleTreeShow: false,
  roleTreeLoading: false,
  roleTreeDefault: [],
});

export const useRole = () => {
  const [state, setState] = useAtom(roleState);

  const fetchAllRoles = useCallback(async () => {
    const res = await getRoleList();
    setState((prev) => ({
      ...prev,
      roleData: res as unknown as RoleWithSystem[],
    }));
  }, [setState]);

  const fetchUserRoles = useCallback(async (userId: number) => {
    const res = await getRoleListWithSystem();
    return (res as unknown as RoleWithSystem[]) || [];
  }, []);

  const assignRoles = useCallback(
    async (userId: number, bathRoles: { systemId: number }[]) => {
      setState((prev) => ({
        ...prev,
        roleTreeLoading: true,
      }));

      await setRolePrivileges({ userId, bathRoles });
      message.success('分配成功');
      setState((prev) => ({
        ...prev,
        roleTreeShow: false,
        roleTreeLoading: false,
      }));
      return true;
    },
    [setState],
  );

  const showRoleTree = useCallback(
    async (userId: number) => {
      const roles = await fetchUserRoles(userId);
      setState((prev) => ({
        ...prev,
        roleTreeShow: true,
        roleTreeDefault: roles.map(
          (role) => `role_sys_${role.systemId}_${role.id}`,
        ),
      }));
    },
    [fetchUserRoles, setState],
  );

  const hideRoleTree = useCallback(() => {
    setState((prev) => ({
      ...prev,
      roleTreeShow: false,
    }));
  }, [setState]);

  return {
    ...state,
    fetchAllRoles,
    showRoleTree,
    hideRoleTree,
    assignRoles,
  };
};
