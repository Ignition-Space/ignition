'use client';

import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { atom } from 'jotai';
import {
  getRoleList,
  getRoleSystemTree,
  createRole,
  updateRole,
  deleteRole,
  getRolePrivileges,
  setRolePrivileges,
} from '../../lib/services/roleService';
import { message } from 'antd';
import type { RoleData } from '../../lib/services/roleService';

// 定义角色状态
interface RoleStateType {
  roleData: RoleData[];
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
    try {
      const params = {
        keyword: '',
        page: {
          currentPage: 1,
          pageSize: 100,
        },
      };
      const res = await getRoleList(params);
      setState((prev) => ({
        ...prev,
        roleData: res.list || [],
      }));
    } catch (error) {
      console.error('获取角色列表失败:', error);
      message.error('获取角色列表失败');
    }
  }, [setState]);

  const fetchUserRoles = useCallback(async (userId: number) => {
    try {
      const res = await getRoleSystemTree();
      return res || [];
    } catch (error) {
      console.error('获取用户角色列表失败:', error);
      message.error('获取用户角色列表失败');
      return [];
    }
  }, []);

  const assignRoles = useCallback(
    async (userId: number, roleIds: string[]) => {
      try {
        setState((prev) => ({
          ...prev,
          roleTreeLoading: true,
        }));

        await setRolePrivileges({
          roleId: Number(userId),
          systemId: 1, // 需要根据实际情况修改
          privileges: roleIds.map((id) => Number(id)),
        });

        message.success('分配成功');
        setState((prev) => ({
          ...prev,
          roleTreeShow: false,
          roleTreeLoading: false,
        }));
        return true;
      } catch (error) {
        console.error('分配角色失败:', error);
        message.error('分配角色失败');
        setState((prev) => ({
          ...prev,
          roleTreeLoading: false,
        }));
        return false;
      }
    },
    [setState],
  );

  const showRoleTree = useCallback(
    async (userId: number) => {
      try {
        const roles = await fetchUserRoles(userId);
        setState((prev) => ({
          ...prev,
          roleTreeShow: true,
          roleTreeDefault: roles.map(
            (role) => `role_sys_${role.systemId}_${role.id}`,
          ),
        }));
      } catch (error) {
        console.error('获取角色树失败:', error);
      }
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
