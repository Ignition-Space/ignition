/** 根路由 **/

import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import loadable from '@loadable/component';

import tools from '@/util/tools';

import { AuthNoLogin, AuthWithLogin, AuthNoPower } from './AuthProvider';
import Loading from '../components/Loading';
import BasicLayout from '@/layouts/BasicLayout';
import UserLayout from '@/layouts/UserLayout';

// 全局提示只显示2秒
message.config({
  duration: 2,
});

import { RootState, Dispatch } from '@/store';

const [
  NotFound,
  NoPower,
  Login,
  Home,
  MenuAdmin,
  PowerAdmin,
  RoleAdmin,
  UserAdmin,
  SystemAdmin,
] = [
  () => import('../pages/ErrorPages/404'),
  () => import('../pages/ErrorPages/401'),
  () => import('../pages/Login'),
  () => import('../pages/Home'),
  () => import('../pages/System/ResourceAdmin'),
  () => import('../pages/System/PrivilegeAdmin'),
  () => import('../pages/System/RoleAdmin'),
  () => import('../pages/System/UserAdmin'),
  () => import('../pages/System/System'),
].map((item) => {
  return loadable(item as any, {
    fallback: <Loading />,
  });
});

function RouterCom(): JSX.Element {
  const dispatch = useDispatch<Dispatch>();
  const userinfo = useSelector((state: RootState) => state.app.userinfo);

  useEffect(() => {
    const userTemp = sessionStorage.getItem('userinfo');
    /**
     * sessionStorage中有user信息，但store中没有
     * 说明刷新了页面，需要重新同步user数据到store
     * **/
    if (userTemp && !userinfo?.userBasicInfo) {
      dispatch.app.setUserInfo(JSON.parse(tools.uncompile(userTemp)));
    }
  }, [dispatch.app, userinfo?.userBasicInfo]);

  return (
    <Routes>
      <Route
        path="/user"
        element={
          <AuthWithLogin>
            <UserLayout />
          </AuthWithLogin>
        }
      >
        <Route path="/user" element={<Navigate to="login" />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="*" element={<Navigate to="login" />} />
      </Route>
      <Route
        path="/"
        element={
          <AuthNoLogin>
            <BasicLayout />
          </AuthNoLogin>
        }
      >
        <Route path="/" element={<Navigate to="home" />} />
        <Route path="home" element={<Home />} />
        <Route
          path="system/resource"
          element={
            <AuthNoPower>
              <MenuAdmin />
            </AuthNoPower>
          }
        />
        <Route
          path="system/privilege"
          element={
            <AuthNoPower>
              <PowerAdmin />
            </AuthNoPower>
          }
        />
        <Route
          path="system/role"
          element={
            <AuthNoPower>
              <RoleAdmin />
            </AuthNoPower>
          }
        />
        <Route
          path="system/admin"
          element={
            <AuthNoPower>
              <SystemAdmin />
            </AuthNoPower>
          }
        />
        <Route
          path="system/user"
          element={
            <AuthNoPower>
              <UserAdmin />
            </AuthNoPower>
          }
        />
        <Route path="404" element={<NotFound />} />
        <Route path="401" element={<NoPower />} />
        <Route path="*" element={<Navigate to="404" />} />
      </Route>
    </Routes>
  );
}

export default RouterCom;
