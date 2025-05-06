import React from 'react';
import { Layout } from 'antd';

import Footer from '../components/Footer';

const { Content } = Layout;

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps): JSX.Element {
  return (
    <Layout className="page-user">
      <Content className="content">
        {children}
      </Content>
      <Footer className="user-layout" />
    </Layout>
  );
}
