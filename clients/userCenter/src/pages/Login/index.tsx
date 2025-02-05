/** 登录页 **/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import { useUser } from '@/hooks/useUser';
import CanvasBack from '@/components/CanvasBack';
import LogoImg from '@/assets/logo.png';
import './index.less';

function LoginContainer(): JSX.Element {
  const navigate = useNavigate();
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
      navigate('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '登录失败';
      message.error(errorMessage);
    }
  };

  return (
    <div className="page-login">
      <div className="canvasBox">
        <CanvasBack row={12} col={8} />
      </div>
      <div className={show ? 'loginBox show' : 'loginBox'}>
        <Form form={form} onFinish={onFinish}>
          <div className="title">
            <img src={LogoImg} alt="logo" />
            <span>IG-User-Center</span>
          </div>
          <Form.Item
            name="username"
            rules={[
              { max: 12, message: '最大长度为12位字符' },
              { required: true, whitespace: true, message: '请输入用户名' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ fontSize: 13 }} />}
              size="large"
              id="username"
              placeholder="username"
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
              prefix={<KeyOutlined style={{ fontSize: 13 }} />}
              size="large"
              type="password"
              placeholder="password"
            />
          </Form.Item>
          <Button
            className="submit-btn"
            size="large"
            type="primary"
            loading={loading}
            htmlType="submit"
          >
            {loading ? '请稍后' : '登录'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default LoginContainer;
