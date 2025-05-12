'use client';

import { useAtom } from 'jotai';
import { useCallback } from 'react';
import {
  privilegeAtom,
  resourceAtom,
  roleAtom,
  adminUserAtom,
} from '../atoms/adminAtoms';
import {
  // 导入类型
  type PrivilegeData,
  type ResourceData,
  type RoleData,
  type UserData,

  // 导入权限服务
  getPrivilegeList,
  createPrivilege,
  updatePrivilege,
  deletePrivilege,

  // 导入资源服务
  getResourceList,
  createResource,
  updateResource,
  deleteResource,

  // 导入角色服务
  getRoleList,
  createRole,
  updateRole,
  deleteRole,

  // 导入用户服务
  getUserList,
  createUser,
  updateUser,
  changeUserStatus,
} from '../../lib/services/admin';

// 创建通用的 CRUD hooks
const createAdminHook = <T extends { id: number }>(
  atom: any,
  services: {
    getList: any;
    add: any;
    update: any;
    delete: any;
  },
) => {
  return () => {
    const [state, setState] = useAtom(atom);

    const fetchList = useCallback(async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const params = {
          keyword: state.searchKeyword || '',
          page: {
            currentPage: 1,
            pageSize: 10,
          },
        };
        const response = await services.getList(params);
        setState((prev) => ({
          ...prev,
          list: response.items || response.list || response || [],
          loading: false,
          error: null,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : '未知错误',
        }));
      }
    }, [setState, state.searchKeyword]);

    const create = useCallback(
      async (values: Omit<T, 'id'>) => {
        try {
          setState((prev) => ({
            ...prev,
            modal: { ...prev.modal, loading: true },
          }));
          await services.add(values);
          await fetchList();
          setState((prev) => ({
            ...prev,
            modal: { ...prev.modal, visible: false, loading: false },
          }));
          return true;
        } catch (err) {
          setState((prev) => ({
            ...prev,
            modal: { ...prev.modal, loading: false },
            error: err instanceof Error ? err.message : '未知错误',
          }));
          return false;
        }
      },
      [setState, fetchList],
    );

    const update = useCallback(
      async (values: T) => {
        try {
          setState((prev) => ({
            ...prev,
            modal: { ...prev.modal, loading: true },
          }));
          await services.update(values);
          await fetchList();
          setState((prev) => ({
            ...prev,
            modal: { ...prev.modal, visible: false, loading: false },
          }));
          return true;
        } catch (err) {
          setState((prev) => ({
            ...prev,
            modal: { ...prev.modal, loading: false },
            error: err instanceof Error ? err.message : '未知错误',
          }));
          return false;
        }
      },
      [setState, fetchList],
    );

    const remove = useCallback(
      async (id: number) => {
        try {
          setState((prev) => ({ ...prev, loading: true }));
          await services.delete(
            services.delete.name.includes('deletePrivilege')
              ? { privilegeId: id }
              : { id },
          );
          await fetchList();
          return true;
        } catch (err) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : '未知错误',
          }));
          return false;
        }
      },
      [setState, fetchList],
    );

    const setSearchKeyword = useCallback(
      (searchKeyword: string) => {
        setState((prev) => ({
          ...prev,
          searchKeyword,
        }));
      },
      [setState],
    );

    const setModalInfo = useCallback(
      (modal: any) => {
        setState((prev) => ({
          ...prev,
          modal: { ...prev.modal, ...modal },
        }));
      },
      [setState],
    );

    return {
      ...state,
      fetchList,
      create,
      update,
      remove,
      setSearchKeyword,
      setModalInfo,
    };
  };
};

// 创建具体的管理 hooks
export const usePrivilege = createAdminHook<PrivilegeData>(privilegeAtom, {
  getList: getPrivilegeList,
  add: createPrivilege,
  update: updatePrivilege,
  delete: deletePrivilege,
});

export const useResource = createAdminHook<ResourceData>(resourceAtom, {
  getList: getResourceList,
  add: createResource,
  update: updateResource,
  delete: deleteResource,
});

export const useRole = createAdminHook<RoleData>(roleAtom, {
  getList: getRoleList,
  add: createRole,
  update: updateRole,
  delete: deleteRole,
});

export const useAdminUser = createAdminHook<UserData>(adminUserAtom, {
  getList: getUserList,
  add: createUser,
  update: updateUser,
  delete: (id: number) => changeUserStatus({ userId: id, status: 0 }),
});
