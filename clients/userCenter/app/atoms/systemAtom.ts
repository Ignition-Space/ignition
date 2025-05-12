'use client';

import { atom } from 'jotai';
import type { SystemData } from '../../lib/services/systemService';

export interface SystemModalState {
  visible: boolean;
  type: 'add' | 'edit';
  loading: boolean;
  currentItem: SystemData | null;
}

export interface SystemState {
  list: SystemData[];
  loading: boolean;
  error: string | null;
  searchKeyword: string;
  modal: SystemModalState;
}

// 初始状态
export const initialSystemState: SystemState = {
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

// 主系统管理状态原子
export const systemAtom = atom<SystemState>(initialSystemState);

// 派生的只读 atoms
export const systemListAtom = atom((get) => get(systemAtom).list);
export const systemLoadingAtom = atom((get) => get(systemAtom).loading);
export const systemErrorAtom = atom((get) => get(systemAtom).error);
export const systemSearchKeywordAtom = atom(
  (get) => get(systemAtom).searchKeyword,
);
export const systemModalAtom = atom((get) => get(systemAtom).modal);
