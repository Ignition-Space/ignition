/** 登录页 **/

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import { useUser } from '@/hooks/useUser';
import CanvasBack from '@/components/CanvasBack';
import LogoImg from '@/assets/logo.png';

function LoginContainer(): JSX.Element {
  const router = useRouter();
  const [form] = Form.useForm();
  const [show, setShow] = useState(false);
  const { loginUser, loading } = useUser();

  useEffect(() => {
    const userLoginInfo = localStorage.getItem('userLoginInfo');
    if (userLoginInfo) {
      const userLoginInfoObj = JSON.parse(userLoginInfo);
      form.setFieldsValue({
        username: userLoginInfoObj.username,
        password: userLoginInfoObj.password,
      });
    }
    document.getElementById(userLoginInfo ? 'vcode' : 'username')?.focus();
    setShow(true);
  }, [form]);

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      await loginUser(values.username, values.password);
      message.success('登录成功');
      router.push('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '登录失败';
      message.error(errorMessage);
    }
  };

  return (
    <div className="absolute inset-0 flex justify-center items-center bg-[#001528]">
      <div className="absolute inset-0 w-full h-full">
        <CanvasBack row={20} col={15} />
      </div>
      <div className={`relative z-10 w-[420px] p-8 rounded-xl backdrop-blur-sm bg-black/10 shadow-xl transition-all duration-500 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <Form form={form} onFinish={onFinish} className="w-full">
          <div className="flex justify-center items-center mb-10">
            <img src={LogoImg.src} alt="logo" className="h-16 mr-3" />
            <span className="text-3xl font-bold text-white tracking-wider">用户中心</span>
          </div>
          <Form.Item
            name="username"
            rules={[
              { max: 12, message: '最大长度为12位字符' },
              { required: true, whitespace: true, message: '请输入用户名' },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              size="large"
              id="username"
              placeholder="用户名"
              className="h-12 rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { max: 18, message: '最大长度18个字符' },
            ]}
          >
            <Input
              prefix={<KeyOutlined className="text-gray-400" />}
              size="large"
              type="password"
              placeholder="密码"
              className="h-12 rounded-lg"
            />
          </Form.Item>
          <Form.Item className="mb-2">
            <Button
              className="w-full h-12 text-lg font-medium rounded-lg"
              size="large"
              type="primary"
              loading={loading}
              htmlType="submit"
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default LoginContainer;
