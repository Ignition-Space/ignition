import React from 'react';
import { Layout, Menu } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import CommonHeader from '../components/CommonHeader';

const { Sider, Content } = Layout;

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      {
        key: '/user',
        icon: <UserOutlined />,
        label: '用户管理',
      },
      {
        key: '/role',
        icon: <UserOutlined />,
        label: '角色管理',
      },
      {
        key: '/privilege',
        icon: <UserOutlined />,
        label: '权限管理',
      },
      {
        key: '/resource',
        icon: <UserOutlined />,
        label: '资源管理',
      },
      {
        key: '/system',
        icon: <SettingOutlined />,
        label: '系统管理',
      },
    ],
  },
];

interface BasicLayoutProps {
  children: React.ReactNode;
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Layout className="basic-layout">
      <CommonHeader />
      <Layout>
        <Sider width={200} className="site-layout-sider">
          <Menu
            mode="inline"
            selectedKeys={pathname ? [pathname] : []}
            defaultOpenKeys={['system']}
            items={menuItems}
            onClick={({ key }) => router.push(key)}
          />
        </Sider>
        <Content className="site-layout-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
