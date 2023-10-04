/** 登录页 **/

// ==================
// 所需的各种插件
// ==================
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import tools from '@/util/tools';

// ==================
// 所需的所有组件
// ==================
import Vcode from 'react-vcode';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import CanvasBack from '@/components/CanvasBack';
import LogoImg from '@/assets/logo.png';


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

// ==================
// CSS
// ==================
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
  const loginIn = useCallback(
    async (username: string, password: string) => {
      let userBasicInfo: UserBasicInfo | null = null;
      let roles: Role[] = [];
      let menus: Menu[] = [];
      let powers: Power[] = [];

      /** 1.登录 （返回信息中有该用户拥有的角色id） **/
      const res1: Res | undefined = await dispatch.app.onLogin({
        username,
        password,
      });
      if (!res1 || res1.status !== 200 || !res1.data) {
        // 登录失败
        return res1;
      }

      userBasicInfo = res1.data;

      /** 2.根据角色id获取角色信息 (角色信息中有该角色拥有的菜单id和权限id) **/
      const res2 = await dispatch.sys.getRoleById({
        id: (userBasicInfo as UserBasicInfo).roles,
      });
      if (!res2 || res2.status !== 200) {
        // 角色查询失败
        return res2;
      }

      roles = res2.data.filter((item: Role) => item.status === 1); // status: 1启用 -1禁用

      /** 3.根据菜单id 获取菜单信息 **/
      const menuAndPowers = roles.reduce(
        (a, b) => [...a, ...b.menuAndPowers],
        [] as MenuAndPower[],
      );
      const res3 = await dispatch.sys.getMenusById({
        id: Array.from(new Set(menuAndPowers.map((item) => item.menuId))),
      });
      if (!res3 || res3.status !== 200) {
        // 查询菜单信息失败
        return res3;
      }

      menus = res3.data.filter((item: Menu) => item.status === 1);

      /** 4.根据权限id，获取权限信息 **/
      const res4 = await dispatch.sys.getPowerById({
        id: Array.from(
          new Set(
            menuAndPowers.reduce(
              (a, b: MenuAndPower) => [...a, ...b.powers],
              [] as number[],
            ),
          ),
        ),
      });
      if (!res4 || res4.status !== 200) {
        // 权限查询失败
        return res4;
      }
      powers = res4.data.filter((item: Power) => item.status === 1);
      return { status: 200, data: { userBasicInfo, roles, menus, powers } };
    },
    [dispatch.sys, dispatch.app],
  );

  // 用户提交登录
  const onSubmit = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const res = await loginIn(values.username, values.password);
      if (res && res.status === 200) {
        message.success('登录成功');
        if (rememberPassword) {
          localStorage.setItem(
            'userLoginInfo',
            JSON.stringify({
              username: values.username,
              password: tools.compile(values.password), // 密码简单加密一下再存到localStorage
            }),
          ); // 保存用户名和密码
        } else {
          localStorage.removeItem('userLoginInfo');
        }
        /** 将这些信息加密后存入sessionStorage,并存入store **/
        sessionStorage.setItem(
          'userinfo',
          tools.compile(JSON.stringify(res.data)),
        );
        await dispatch.app.setUserInfo(res.data);
        navigate('/'); // 跳转到主页
      } else {
        message.error(res?.message ?? '登录失败');
        setLoading(false);
      }
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
                placeholder="admin/user"
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
                placeholder="123456/123456"
                onPressEnter={onSubmit}
              />
            </Form.Item>
            <Form.Item>
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
            </Form.Item>
            <div style={{ lineHeight: '40px' }}>
              <Checkbox
                className="remember"
                checked={rememberPassword}
                onChange={onRemember}
              >
                记住密码
              </Checkbox>
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
      </div>
    </div>
  );
}

export default LoginContainer;
