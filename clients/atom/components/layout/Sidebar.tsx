'use client';

import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import {
  HomeOutlined,
  ToolOutlined,
  AppstoreOutlined,
  CloudServerOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  className = '',
}) => {
  const pathname = usePathname();
  const router = useRouter();

  // 侧边栏菜单项
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/design',
      icon: <AppstoreOutlined />,
      label: 'BOTY DESIGN',
    },
    {
      key: '/tools/cli',
      icon: <ToolOutlined />,
      label: 'BOTY CLI',
    },
    {
      key: '/devops',
      icon: <CloudServerOutlined />,
      label: 'DEVOPS 平台',
    },
  ];

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    return menuItems
      .filter((item) => pathname.startsWith(item.key))
      .map((item) => item.key);
  };

  return (
    <Sider
      width={220}
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      className={`site-layout-sider transition-all duration-300 h-screen overflow-auto fixed left-0 top-0 bottom-0 md:relative z-20 ${className}`}
      style={{ background: 'var(--layout-sider-background)' }}
      breakpoint="md"
    >
      <div className="p-4 h-16 flex items-center justify-center">
        <div className="text-white text-xl font-bold">
          {collapsed ? 'HuoS' : '火石设计 HuoS'}
        </div>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={getSelectedKeys()}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar; 