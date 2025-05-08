'use client';

import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { systemAtom } from '../atoms/systemAtom';
import {
  getSystemList,
  createSystem,
  updateSystem,
  deleteSystem,
  type SystemData,
  type CreateSystemParams,
  type UpdateSystemParams,
  type DeleteSystemParams,
} from '../../lib/services/systemService';
import { message } from 'antd';

export const useSystem = () => {
  const [state, setState] = useAtom(systemAtom);

  const fetchSystemList = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await getSystemList();
      setState((prev) => ({
        ...prev,
        list: response || [],
        loading: false,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : '未知错误',
      }));
      message.error('获取系统列表失败');
    }
  }, [setState]);

  const addNewSystem = useCallback(
    async (values: CreateSystemParams) => {
      try {
        setState((prev) => ({
          ...prev,
          modal: { ...prev.modal, loading: true },
        }));

        await createSystem(values);
        await fetchSystemList();

        setState((prev) => ({
          ...prev,
          modal: { ...prev.modal, visible: false, loading: false },
        }));

        message.success('创建系统成功');
        return true;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          modal: { ...prev.modal, loading: false },
          error: err instanceof Error ? err.message : '未知错误',
        }));

        message.error('创建系统失败');
        return false;
      }
    },
    [setState, fetchSystemList],
  );

  const updateSystemItem = useCallback(
    async (values: UpdateSystemParams) => {
      try {
        setState((prev) => ({
          ...prev,
          modal: { ...prev.modal, loading: true },
        }));

        await updateSystem(values);
        await fetchSystemList();

        setState((prev) => ({
          ...prev,
          modal: { ...prev.modal, visible: false, loading: false },
        }));

        message.success('更新系统成功');
        return true;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          modal: { ...prev.modal, loading: false },
          error: err instanceof Error ? err.message : '未知错误',
        }));

        message.error('更新系统失败');
        return false;
      }
    },
    [setState, fetchSystemList],
  );

  const removeSystem = useCallback(
    async (id: number) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        await deleteSystem({ id });
        await fetchSystemList();

        setState((prev) => ({
          ...prev,
          loading: false,
        }));

        message.success('删除系统成功');
        return true;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : '未知错误',
        }));

        message.error('删除系统失败');
        return false;
      }
    },
    [setState, fetchSystemList],
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
    (modal: Partial<typeof state.modal>) => {
      setState((prev) => ({
        ...prev,
        modal: { ...prev.modal, ...modal },
      }));
    },
    [setState],
  );

  return {
    ...state,
    fetchSystemList,
    createSystem: addNewSystem,
    updateSystem: updateSystemItem,
    deleteSystem: removeSystem,
    setSearchKeyword,
    setModalInfo,
  };
};
