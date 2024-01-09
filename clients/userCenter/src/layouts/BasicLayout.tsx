import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { Layout, message } from 'antd';

import './BasicLayout.less';

import Header from '@/components/Header';
import MenuCom from '@/components/Menu';
import Footer from '@/components/Footer';
// import Bread from '@/components/Bread';

const { Content } = Layout;

import type { RootState, Dispatch } from '@/store';

function BasicLayoutCom(): JSX.Element {
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();
  const userinfo = useSelector((state: RootState) => state.app.userinfo);
  const [collapsed, setCollapsed] = useState(false); // 菜单栏是否收起

  // 退出登录
  const onLogout = () => {
    dispatch.app.onLogout().then(() => {
      message.success('退出成功');
      navigate('/user/login');
    });
  };

  return (
    <Layout className="page-basic" hasSider>
      <MenuCom data={userinfo?.menus} collapsed={collapsed} />
      <Layout>
        <Header
          collapsed={collapsed}
          userinfo={userinfo}
          onToggle={() => setCollapsed(!collapsed)}
          onLogout={onLogout}
        />
        {/* <Bread menus={userinfo.menus} /> */}
        <Content className="content">
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default BasicLayoutCom;
