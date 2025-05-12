'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Space, Avatar } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  KeyOutlined,
  AppstoreOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

interface BasicLayoutProps {
  children: React.ReactNode;
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // 处理菜单折叠
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  // 用户下拉菜单项
  const userMenuItems = [
    {
      key: 'profile',
      label: '个人信息',
      icon: <UserOutlined />,
      onClick: () => router.push('/dashboard/profile'),
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  // 主导航菜单项
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/user',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: '/role',
      icon: <TeamOutlined />,
      label: '角色管理',
    },
    {
      key: '/privilege',
      icon: <KeyOutlined />,
      label: '权限管理',
    },
    {
      key: '/resource',
      icon: <AppstoreOutlined />,
      label: '资源管理',
    },
    {
      key: '/system',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  // 获取当前选中的菜单项
  const getSelectedKey = () => {
    // 从pathname中提取主路径部分
    const mainPath = '/' + (pathname?.split('/')[1] || 'dashboard');
    return [mainPath];
  };

  return (
    <Layout className="min-h-screen">
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        className="site-layout-sider"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 999,
        }}
      >
        {/* 品牌标志 */}
        <div className="h-16 flex items-center justify-center text-white m-0 p-0">
          <h1
            className={`font-bold transition-all duration-300 ${collapsed ? 'text-xl' : 'text-2xl'}`}
          >
            {collapsed ? 'UC' : '用户中心'}
          </h1>
        </div>

        {/* 主导航菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKey()}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          className="border-r-0"
        />
      </Sider>

      {/* 主内容区 */}
      <Layout
        style={{ marginLeft: collapsed ? 80 : 240, transition: 'all 0.2s' }}
      >
        {/* 顶部导航栏 */}
        <Header
          className="site-layout-header flex justify-between items-center px-6"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            padding: '0 24px',
            background: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* 折叠按钮 */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            className="mr-4 flex items-center justify-center"
            style={{ fontSize: '16px', width: 40, height: 40 }}
          />

          {/* 用户信息 */}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space className="cursor-pointer">
              <Avatar icon={<UserOutlined />} />
              <span className="hidden sm:inline">管理员</span>
            </Space>
          </Dropdown>
        </Header>

        {/* 内容区 */}
        <Content
          className="site-layout-content mx-3 my-3"
          style={{
            overflow: 'initial',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
