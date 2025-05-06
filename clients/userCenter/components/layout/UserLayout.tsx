'use client';

import React from 'react';
import { Layout } from 'antd';

const { Content, Footer } = Layout;

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps): JSX.Element {
  return (
    <Layout className="page-user">
      <Content className="content">{children}</Content>
      <Footer className="user-layout">
        版权所有 © {new Date().getFullYear()} 用户中心
      </Footer>
    </Layout>
  );
}
