import { atom } from 'jotai';

export interface LayoutState {
  collapsed: boolean;
  menuData: any[];
  loading: boolean;
}

export const layoutAtom = atom<LayoutState>({
  collapsed: false,
  menuData: [],
  loading: false,
});

export const collapsedAtom = atom(
  (get) => get(layoutAtom).collapsed,
  (get, set, collapsed: boolean) =>
    set(layoutAtom, { ...get(layoutAtom), collapsed }),
);

export const menuDataAtom = atom(
  (get) => get(layoutAtom).menuData,
  (get, set, menuData: any[]) =>
    set(layoutAtom, { ...get(layoutAtom), menuData }),
);
