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
  getPrivilegeList,
  addPrivilege,
  updatePrivilege,
  deletePrivilege,
  getResourceList,
  addResource,
  updateResource,
  deleteResource,
  getRoleList,
  addRole,
  updateRole,
  deleteRole,
  getAdminUserList,
  addAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '../../lib/services/admin';
import type {
  Privilege,
  Resource,
  Role,
  AdminUser,
} from '../../lib/types/admin';

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
        const response = await services.getList(state.searchInfo);
        setState((prev) => ({
          ...prev,
          list: response.items || response,
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
    }, [setState, state.searchInfo]);

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
          await services.delete(id);
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

    const setSearchInfo = useCallback(
      (searchInfo: any) => {
        setState((prev) => ({
          ...prev,
          searchInfo: { ...prev.searchInfo, ...searchInfo },
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
      setSearchInfo,
      setModalInfo,
    };
  };
};

// 创建具体的管理 hooks
export const usePrivilege = createAdminHook<Privilege>(privilegeAtom, {
  getList: getPrivilegeList,
  add: addPrivilege,
  update: updatePrivilege,
  delete: deletePrivilege,
});

export const useResource = createAdminHook<Resource>(resourceAtom, {
  getList: getResourceList,
  add: addResource,
  update: updateResource,
  delete: deleteResource,
});

export const useRole = createAdminHook<Role>(roleAtom, {
  getList: getRoleList,
  add: addRole,
  update: updateRole,
  delete: deleteRole,
});

export const useAdminUser = createAdminHook<AdminUser>(adminUserAtom, {
  getList: getAdminUserList,
  add: addAdminUser,
  update: updateAdminUser,
  delete: deleteAdminUser,
});
