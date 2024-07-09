/** 登录页 **/

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import tools from '@/util/tools';
import axios from '@/util/axios'; // 自己写的工具函数，封装了请求数据的通用接口

import Vcode from 'react-vcode';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import CanvasBack from '@/components/CanvasBack';
import LogoImg from '@/assets/logo.png';
import GithubLogo from '@/assets/github-logo.png';

import { Dispatch } from '@/store';
import {
  Role,
  Menu,
  Power,
  UserBasicInfo,
  Res,
  MenuAndPower,
} from '@/models/index.type';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import './index.less';

function LoginContainer(): JSX.Element {
  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // 是否正在登录中
  const [rememberPassword, setRememberPassword] = useState(false); // 是否记住密码
  const [codeValue, setCodeValue] = useState('00000'); // 当前验证码的值
  const [show, setShow] = useState(false); // 加载完毕时触发动画

  // 进入登陆页时，判断之前是否保存了用户名和密码
  useEffect(() => {
    const userLoginInfo = localStorage.getItem('userLoginInfo');
    if (userLoginInfo) {
      const userLoginInfoObj = JSON.parse(userLoginInfo);
      setRememberPassword(true);

      form.setFieldsValue({
        username: userLoginInfoObj.username,
        password: tools.uncompile(userLoginInfoObj.password),
      });
    }
    if (!userLoginInfo) {
      document.getElementById('username')?.focus();
    } else {
      document.getElementById('vcode')?.focus();
    }
    setShow(true);
  }, [form]);

  /**
   * 执行登录
   * 这里模拟：
   * 1.登录，得到用户信息
   * 2.通过用户信息获取其拥有的所有角色信息
   * 3.通过角色信息获取其拥有的所有权限信息
   * **/

  const onSubmit = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      console.log('values===>?', values);
      const res = await axios.post('/auth/login', {
        ...values,
      });
      if (res.success) {
        navigate('/'); // 跳转到主页
      }
      console.log('login====>', res);
    } catch (e) {
      // 验证未通过
    }
  };

  // 记住密码按钮点击
  const onRemember = (e: CheckboxChangeEvent): void => {
    setRememberPassword(e.target.checked);
  };

  // 验证码改变时触发
  const onVcodeChange = (code: string | null): void => {
    form.setFieldsValue({
      vcode: code, // 开发模式自动赋值验证码，正式环境，这里应该赋值''
    });
    setCodeValue(code || '');
  };

  return (
    <div className="page-login">
      <div className="canvasBox">
        <CanvasBack row={12} col={8} />
      </div>
      <div className={show ? 'loginBox show' : 'loginBox'}>
        <Form form={form}>
          <div className="title">
            <img src={LogoImg} alt="logo" />
            <span>IG-User-Center</span>
          </div>
          <div>
            <Form.Item
              name="username"
              rules={[
                { max: 12, message: '最大长度为12位字符' },
                {
                  required: true,
                  whitespace: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ fontSize: 13 }} />}
                size="large"
                id="username" // 为了获取焦点
                placeholder="username"
                onPressEnter={onSubmit}
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
                onPressEnter={onSubmit}
              />
            </Form.Item>
            {/* <Form.Item>
              <Form.Item
                name="vcode"
                noStyle
                rules={[
                  (): any => ({
                    validator: (rule: any, value: string): Promise<any> => {
                      const v = tools.trim(value);
                      if (v) {
                        if (v.length > 4) {
                          return Promise.reject('验证码为4位字符');
                        } else if (
                          v.toLowerCase() !== codeValue.toLowerCase()
                        ) {
                          return Promise.reject('验证码错误');
                        } else {
                          return Promise.resolve();
                        }
                      } else {
                        return Promise.reject('请输入验证码');
                      }
                    },
                  }),
                ]}
              >
                <Input
                  style={{ width: '200px' }}
                  size="large"
                  id="vcode" // 为了获取焦点
                  placeholder="请输入验证码"
                  onPressEnter={onSubmit}
                />
              </Form.Item>
              <Vcode
                height={40}
                width={150}
                onChange={onVcodeChange}
                className="vcode"
                style={{ color: '#f00' }}
                options={{
                  lines: 16,
                }}
              />
            </Form.Item> */}
            <div style={{ width: '100%' }}>
              <Button
                className="submit-btn"
                size="large"
                type="primary"
                loading={loading}
                onClick={onSubmit}
              >
                {loading ? '请稍后' : '登录'}
              </Button>
            </div>
          </div>
        </Form>
        {/* <p style={{ marginTop: 20, color: '#fff' }}>三方登录：</p>
        <div style={{ marginTop: 20 }}>
          <img
            src={GithubLogo}
            width={50}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              window.location.replace(
                'https://github.com/login/oauth/authorize?client_id=bba8412da9b0f3e88380&redirect_uri=http%3A%2F%2Fwww.ig-space.com%2Flogin',
              );
            }}
          />
        </div> */}
      </div>
    </div>
  );
}

export default LoginContainer;
