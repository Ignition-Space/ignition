'use client';

import React from 'react';
import { Layout } from 'antd';
import Header from './Header';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout className="min-h-screen">
      {/* 主内容区 */}
      <Layout>
        {/* 顶部导航 */}
        <Header />

        {/* 内容区 */}
        <Content
          className="p-4 md:p-6 site-layout-content"
          style={{
            backgroundColor: 'var(--layout-body-background)',
            minHeight: 'calc(100vh - 64px)'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 