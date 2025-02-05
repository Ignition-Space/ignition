import { atom } from 'jotai';

export interface RoleData {
  id: number;
  name: string;
  systemId: number;
}

interface RoleState {
  roleData: RoleData[];
  roleTreeLoading: boolean;
  roleTreeShow: boolean;
  roleTreeDefault: string[];
}

export const roleState = atom<RoleState>({
  roleData: [],
  roleTreeLoading: false,
  roleTreeShow: false,
  roleTreeDefault: [],
});
