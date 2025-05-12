'use client';

import { useState } from 'react';
import { Layout, Menu, theme, Typography } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AppstoreOutlined,
  CodeOutlined,
  BlockOutlined,
  HomeOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const menuItems = [
  {
    key: '/components/basic',
    icon: <AppstoreOutlined />,
    label: <Link href="/components/basic">基础组件</Link>,
  },
  {
    key: '/components/business',
    icon: <BlockOutlined />,
    label: <Link href="/components/business">业务组件</Link>,
  },
  {
    key: '/components/editor',
    icon: <CodeOutlined />,
    label: <Link href="/components/editor">编辑器组件</Link>,
  },
];

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="bg-white flex items-center justify-between px-6">
        <div className="flex items-center">
          <Title level={3} style={{ margin: 0 }}>
            <Link href="/" className="flex items-center">
              <HomeOutlined className="mr-2" />
              火石组件库
            </Link>
          </Title>
        </div>
      </Header>
      <Layout>
        <Sider
          width={230}
          style={{ background: colorBgContainer }}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={[pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout className="p-6">
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}