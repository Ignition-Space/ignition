import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { systemAtom } from '@/atoms/systemAtom';
import {
  getSystemList,
  addSystem,
  updateSystem,
  deleteSystem,
} from '@/services/system';
import type { SystemItem } from '@/types/system';

export const useSystem = () => {
  const [state, setState] = useAtom(systemAtom);

  const fetchSystemList = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await getSystemList(state.searchInfo);
      setState((prev) => ({
        ...prev,
        list: response,
        loading: false,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }));
    }
  }, [setState, state.searchInfo]);

  const createSystem = useCallback(
    async (values: Omit<SystemItem, 'id'>) => {
      try {
        setState((prev) => ({
          ...prev,
          modal: { ...prev.modal, loading: true },
        }));
        await addSystem(values);
        await fetchSystemList();
        setState((prev) => ({
          ...prev,
          modal: { ...prev.modal, visible: false, loading: false },
        }));
        return true;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          modal: { ...prev.modal, loading: false },
          error: err instanceof Error ? err.message : 'Unknown error',
        }));
        return false;
      }
    },
    [setState, fetchSystemList],
  );

  const updateSystemItem = useCallback(
    async (values: SystemItem) => {
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
        return true;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          modal: { ...prev.modal, loading: false },
          error: err instanceof Error ? err.message : 'Unknown error',
        }));
        return false;
      }
    },
    [setState, fetchSystemList],
  );

  const deleteSystemItem = useCallback(
    async (id: number) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        await deleteSystem(id);
        await fetchSystemList();
        return true;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        }));
        return false;
      }
    },
    [setState, fetchSystemList],
  );

  const setSearchInfo = useCallback(
    (searchInfo: Partial<SystemState['searchInfo']>) => {
      setState((prev) => ({
        ...prev,
        searchInfo: { ...prev.searchInfo, ...searchInfo },
      }));
    },
    [setState],
  );

  const setModalInfo = useCallback(
    (modal: Partial<SystemState['modal']>) => {
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
    createSystem,
    updateSystemItem,
    deleteSystemItem,
    setSearchInfo,
    setModalInfo,
  };
};
