'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Input, Button, message, Spin } from 'antd';
import { UserOutlined, LockOutlined, RightOutlined } from '@ant-design/icons';
import CanvasBack from '../../components/CanvasBack';

const LoginContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const fromPath = searchParams.get('from') || '/dashboard';

  useEffect(() => {
    // 检查用户是否已登录
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
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

    try {
      // 模拟登录请求
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟成功登录
      if (values.username === 'admin' && values.password === 'admin') {
        // 存储token到localStorage
        const token = 'mock-jwt-token';
        localStorage.setItem('token', token);

        // 同时存储到cookie以便服务端中间件识别
        document.cookie = `token=${token}; path=/; max-age=86400; secure; samesite=strict`;

        message.success('登录成功');

        // 跳转到来源页或默认页
        router.push(fromPath);
      } else {
        message.error('用户名或密码错误');
      }
    } catch (error) {
      message.error('登录失败，请稍后再试');
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
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="login-container">
      {/* 背景效果 */}
      <div className="absolute inset-0 w-full h-full">
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800"
          style={{ opacity: 0.95 }}
        ></div>
        <CanvasBack row={12} col={12} />
      </div>

      {/* 登录框 */}
      <div className={loginFormClass}>
        <div className="mb-10 text-center">
          <div className="inline-block p-4 rounded-full bg-white/10 mb-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-blue-400"
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
          <h2 className="text-3xl font-bold text-white mb-2">用户中心</h2>
          <p className="text-blue-300">欢迎回来，请登录您的账号</p>
        </div>

        <Form
          form={form}
          name="login"
          initialValues={{ username: 'admin', password: 'admin' }}
          onFinish={handleSubmit}
          size="large"
          className="space-y-6"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-blue-400" />}
              placeholder="用户名 (admin)"
              autoComplete="off"
              className="bg-white/5 border-white/10 text-white h-12 rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-blue-400" />}
              placeholder="密码 (admin)"
              className="bg-white/5 border-white/10 text-white h-12 rounded-lg"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 text-lg font-medium rounded-lg"
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
