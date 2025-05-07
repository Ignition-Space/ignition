'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Input, Button, message, Spin, Alert } from 'antd';
import { UserOutlined, LockOutlined, RightOutlined } from '@ant-design/icons';
import ParticleBackground from '../../components/ParticleBackground';
import ThemeToggle, { THEME_CHANGE_EVENT } from '../../components/ThemeToggle';
import { login, isAuthenticated } from '../../lib/services/authService';

const LoginContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 获取from参数，如果没有则默认为dashboard
  const fromPath = searchParams.get('from') || '/dashboard';

  // 检查token过期信息
  const tokenExpired = searchParams.get('expired') === 'true';

  useEffect(() => {
    // 检查当前主题模式
    const checkTheme = () => {
      // 检查是否有保存的主题偏好
      const savedTheme = localStorage.getItem('theme');
      const isDark =
        savedTheme === 'dark' ||
        (!savedTheme &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

      setIsDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    };

    checkTheme();

    // 监听主题变化
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        setIsDarkMode(e.newValue === 'dark');
      }
    };

    // 监听自定义主题变化事件
    const handleThemeChange = (e: CustomEvent) => {
      setIsDarkMode(e.detail.isDarkMode);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(
      THEME_CHANGE_EVENT,
      handleThemeChange as EventListener,
    );

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        THEME_CHANGE_EVENT,
        handleThemeChange as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    // 检查用户是否已登录
    const checkAuth = async () => {
      if (isAuthenticated()) {
        // 如果已登录，直接跳转
        router.push(fromPath);
      } else {
        setInitializing(false);
        // 显示动画效果
        setTimeout(() => setShow(true), 100);
      }
    };

    checkAuth();
  }, [router, fromPath]);

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    if (!values.username || !values.password) {
      message.error('请输入用户名和密码');
      return;
    }

    setLoading(true);
    setLoginError(null);

    try {
      // 调用登录API
      const response = await login({
        username: values.username,
        password: values.password,
      });

      // 成功登录
      if (response && response.token) {
        message.success('登录成功');

        // 跳转到来源页或默认页
        router.push(fromPath);
      } else {
        // 服务器返回成功但没有token
        setLoginError('登录失败：服务器未返回有效的认证信息');
      }
    } catch (error: any) {
      console.error('登录错误:', error);
      setLoginError(error.message || '登录失败，请检查用户名和密码');
      message.error('登录失败');
    } finally {
      setLoading(false);
    }
  };

  // 为登录框创建动态类名
  const loginFormClass = `login-form transition-all duration-500 ${show
      ? 'opacity-100 scale-100 translate-y-0'
      : 'opacity-0 scale-95 translate-y-10'
    }`;

  // 如果正在初始化，显示加载状态
  if (initializing) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-blue-50'
          }`}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="login-container relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0 w-full h-full">
        <ParticleBackground
          theme={isDarkMode ? 'dark' : 'light'}
          particleCount={80}
          connectDistance={150}
          mouseInteraction={true}
        />
      </div>

      {/* 主题切换按钮 */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* 登录框 */}
      <div
        className={`${loginFormClass} relative z-10 w-11/12 max-w-md p-8 rounded-xl backdrop-blur-lg shadow-2xl border border-white/20`}
        style={{
          backgroundColor: isDarkMode
            ? 'rgba(15, 23, 42, 0.2)'
            : 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="mb-8 text-center">
          <div
            className={`inline-block p-5 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-bolt-primary/10'
              } mb-6`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-12 w-12 ${isDarkMode ? 'text-blue-400' : 'text-bolt-primary'
                }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2
            className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-bolt-primary'
              } mb-2`}
          >
            用户中心
          </h2>
          <p className={isDarkMode ? 'text-blue-300' : 'text-blue-600'}>
            欢迎回来，请登录您的账号
          </p>
        </div>

        {/* 显示token过期提醒 */}
        {tokenExpired && (
          <Alert
            message="登录已过期，请重新登录"
            type="warning"
            showIcon
            className="mb-6"
          />
        )}

        {/* 显示登录错误信息 */}
        {loginError && (
          <Alert message={loginError} type="error" showIcon className="mb-6" />
        )}

        <Form
          form={form}
          name="login"
          initialValues={{ username: '', password: '' }}
          onFinish={handleSubmit}
          size="large"
          className="space-y-6"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              prefix={
                <UserOutlined
                  className={isDarkMode ? 'text-blue-400' : 'text-bolt-primary'}
                />
              }
              placeholder="用户名"
              autoComplete="off"
              className={`${isDarkMode
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-white border-gray-200 text-gray-800'
                } h-12 rounded-lg`}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={
                <LockOutlined
                  className={isDarkMode ? 'text-blue-400' : 'text-bolt-primary'}
                />
              }
              placeholder="密码"
              className={`${isDarkMode
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-white border-gray-200 text-gray-800'
                } h-12 rounded-lg`}
            />
          </Form.Item>

          <Form.Item className="mb-0 pt-2">
            <Button
              type="primary"
              htmlType="submit"
              className={`w-full h-12 text-lg font-medium rounded-lg ${!isDarkMode && 'bg-bolt-primary hover:bg-bolt-primary/90'
                }`}
              loading={loading}
              icon={loading ? null : <RightOutlined />}
            >
              {loading ? '登录中...' : '登录系统'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default function LoginPage() {
  return <LoginContainer />;
}
