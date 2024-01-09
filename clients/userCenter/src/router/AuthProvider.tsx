// 路由守卫

import React, { useEffect, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, Dispatch } from '@/store';

interface Props {
  children: JSX.Element;
}

// 未登录的用户，重定向到登录页
export function AuthNoLogin(props: Props) {
  const userinfo = useSelector((state: RootState) => state.app.userinfo);

  console.log('userinfo===>', userinfo);

  return props.children;
}

// 已登录的用户，不应该进入login页，直接重定向到主页
export const AuthWithLogin = (props: Props) => {
  const dispatch = useDispatch();

  // dispatch.app.getUserinfo();
  const userinfo = useSelector((state: RootState) => state.app.userinfo);

  return props.children;
};

// 已登录，但没有权限访问当前页面，跳401
export function AuthNoPower(props: Props) {
  const location = useLocation();
  const dispatch = useDispatch<Dispatch>();

  const userinfo = useSelector((state: RootState) => state.app.userinfo);

  useEffect(() => {
    if (!userinfo.id) {
      dispatch.app.getUserInfo();
    }
  }, []);

  //  判断当前用户是否有该路由权限，如果没有就跳转至401页
  // const isHavePower = useMemo(() => {
  //   let menus: Menu[] = [];
  //   if (userinfo.menus && userinfo.menus.length) {
  //     menus = userinfo.menus;
  //   } else if (sessionStorage.getItem('userinfo')) {
  //     menus = JSON.parse(
  //       tools.uncompile(sessionStorage.getItem('userinfo') || '[]'),
  //     ).menus;
  //   }
  //   const m: string[] = menus.map((item) => item.url); // 当前用户拥有的所有菜单

  //   if (m.includes(location.pathname)) {
  //     return true;
  //   }
  //   return false;
  // }, [userinfo, location.pathname]);

  console.log('auth:', userinfo, location.pathname);

  return props.children;
}
