/** 全局唯一数据中心 **/

import { init, Models, RematchDispatch, RematchRootState } from '@rematch/core';

import app from '@/models/app';
import sys from '@/models/sys';
import role from '@/models/role';

export interface RootModel extends Models<RootModel> {
  app: typeof app;
  sys: typeof sys;
}

const rootModel: RootModel = { app, sys, role };

const store = init({
  models: rootModel,
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

export default store;
