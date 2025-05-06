'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { Spin } from 'antd';

// 不需要登录的路径
const publicPaths = ['/login'];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [{ user, loading }, setUserState] = useAtom(userAtom);
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // 尝试从localStorage获取token
      const token = localStorage.getItem('token');

      // 如果没有token且不在公开路径上，重定向到登录页
      if (!token && !publicPaths.includes(pathname || '')) {
        router.push('/login');
      } else if (token && !user && !publicPaths.includes(pathname || '')) {
        // 如果有token但没有用户信息，尝试获取用户信息
        // 这部分可以根据具体实现调整
        try {
          // 这里可以调用API获取用户信息
          // 暂时使用模拟数据
          setUserState((prev) => ({
            ...prev,
            user: {
              id: '1',
              username: '管理员',
              avatar: '',
              roles: ['admin'],
            },
          }));
        } catch (err) {
          console.error('Error fetching user info:', err);
          // 获取用户信息失败，清除token并重定向到登录页
          localStorage.removeItem('token');
          router.push('/login');
        }
      } else if (token && pathname === '/login') {
        // 如果已登录但访问登录页，重定向到dashboard
        router.push('/dashboard');
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [pathname, user, router, setUserState]);

  // 如果是初始加载状态或正在获取用户信息，显示加载中
  if (isCheckingAuth || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#001528]">
        <Spin size="large" tip="正在加载..." />
      </div>
    );
  }

  return <>{children}</>;
}
