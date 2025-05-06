'use client';

import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  KeyOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
      onClick: () => router.push('/dashboard'),
    },
    {
      key: 'user',
      icon: <UserOutlined />,
      label: '用户管理',
      onClick: () => router.push('/user'),
    },
    {
      key: 'role',
      icon: <TeamOutlined />,
      label: '角色管理',
      onClick: () => router.push('/role'),
    },
    {
      key: 'privilege',
      icon: <KeyOutlined />,
      label: '权限管理',
      onClick: () => router.push('/privilege'),
    },
    {
      key: 'resource',
      icon: <AppstoreOutlined />,
      label: '资源管理',
      onClick: () => router.push('/resource'),
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: '系统设置',
      onClick: () => router.push('/system'),
    },
  ];

  // 根据当前路径获取当前活动菜单项
  const getSelectedKeys = () => {
    const path = pathname.split('/')[1] || 'dashboard';
    return [path];
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className="min-h-screen bg-gray-900 text-white"
    >
      <div className="h-16 flex items-center justify-center">
        <h1
          className={`text-white font-bold ${collapsed ? 'text-sm' : 'text-xl'}`}
        >
          {collapsed ? 'UC' : '用户中心'}
        </h1>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={getSelectedKeys()}
        items={menuItems}
        className="border-r-0"
      />
    </Sider>
  );
}
