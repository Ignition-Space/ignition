// 路由守卫

import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from '@/atoms/userAtom';
import { useNavigate, Outlet } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { Spin } from 'antd';
import { getStorageItem, removeStorageItem } from '@/util/storage';

interface Props {
  children: JSX.Element;
}

const publicPaths = ['/login'];
export const AuthProvider = () => {
  const { user, loading, fetchUserInfo } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getStorageItem('token');

    // 第一次进入页面时检查token和用户状态
    if (token) {
      fetchUserInfo()
        .then(() => {
          console.log('fetchUserInfo success');
        })
        .catch(() => {
          removeStorageItem('token');
          navigate('/login', { replace: true });
        });
    } else if (!publicPaths.includes(location.pathname)) {
      // 无token且不在公开路径时跳转登录页
      navigate('/login', { replace: true });
    }
  }, []); // 仅在组件挂载时执行一次

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return <Outlet />;
};

// 未登录的用户，重定向到登录页
export function AuthNoLogin({ children }: Props) {
  const currentUser = useAtomValue(currentUserAtom);

  if (!currentUser) {
    console.warn('User not logged in, redirecting to login page.');
    // Add redirection logic here
  }

  return children;
}

// 已登录的用户，不应该进入login页，直接重定向到主页
export const AuthWithLogin = ({ children }: Props) => {
  const currentUser = useAtomValue(currentUserAtom);

  if (currentUser) {
    console.warn('User already logged in, redirecting to home page.');
    // Add redirection logic here
  }

  return children;
};
