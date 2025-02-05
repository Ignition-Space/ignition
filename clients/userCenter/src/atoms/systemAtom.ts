import { atom } from 'jotai';
import type { SystemState } from '@/types/system';

export const initialSystemState: SystemState = {
  systemList: [],
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
    currentItem: null,
  },
};

export const systemAtom = atom<SystemState>(initialSystemState);

// 派生的只读 atoms
export const systemListAtom = atom((get) => get(systemAtom).systemList);
export const systemLoadingAtom = atom((get) => get(systemAtom).loading);
export const systemErrorAtom = atom((get) => get(systemAtom).error);
export const systemSearchInfoAtom = atom((get) => get(systemAtom).searchInfo);
export const systemModalAtom = atom((get) => get(systemAtom).modal);
