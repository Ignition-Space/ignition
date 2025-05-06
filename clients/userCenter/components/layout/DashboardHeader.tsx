'use client';

import React from 'react';
import { Layout, Button, Dropdown, Space, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const { Header } = Layout;

interface DashboardHeaderProps {
  collapsed?: boolean;
  toggle?: () => void;
}

export default function DashboardHeader({
  collapsed,
  toggle,
}: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    // 清除用户登录信息
    localStorage.removeItem('token');
    router.push('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: <Link href="/dashboard/profile">个人信息</Link>,
      icon: <UserOutlined />,
    },
    {
      key: 'logout',
      label: <span onClick={handleLogout}>退出登录</span>,
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Header className="bg-white px-4 flex justify-between items-center shadow-sm">
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggle}
        className="trigger"
      />

      <div className="flex items-center">
        <Dropdown menu={{ items: userMenuItems }}>
          <Space className="cursor-pointer">
            <Avatar icon={<UserOutlined />} />
            <span>管理员</span>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
}
