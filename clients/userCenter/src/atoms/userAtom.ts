import { atom } from 'jotai';
import { IUser } from '@/services/user';

export interface UserState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
}

export const userAtom = atom<UserState>({
  user: null,
  loading: false,
  error: null,
});

// 派生的只读 atoms
export const userLoadingAtom = atom((get) => get(userAtom).loading);
export const userErrorAtom = atom((get) => get(userAtom).error);
export const currentUserAtom = atom((get) => get(userAtom).user);
