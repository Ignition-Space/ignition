import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

import './UserLayout.less';

import Footer from '../components/Footer';

const { Content } = Layout;

export default function AppContainer(): JSX.Element {
  return (
    <Layout className="page-user">
      <Content className="content">
        <Outlet />
      </Content>
      <Footer className="user-layout" />
    </Layout>
  );
}
