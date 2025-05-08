'use client';

import React, { useState } from 'react';
import { Layout, Menu, Flex, Typography, Dropdown, Button } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  HomeOutlined,
  ToolOutlined,
  AppstoreOutlined,
  CloudServerOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import ThemeToggle from '../ThemeToggle';
import GlobalSearch from '../GlobalSearch';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 导航菜单项
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/design',
      icon: <AppstoreOutlined />,
      label: 'IG DESIGN',
    },
    {
      key: '/tools/cli',
      icon: <ToolOutlined />,
      label: 'IG CLI',
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
      .filter((item) => pathname === item.key || pathname.startsWith(item.key) && item.key !== '/')
      .map((item) => item.key);
  };

  // 移动设备上的下拉菜单
  const mobileMenuItems = menuItems.map((item) => ({
    key: item.key,
    label: (
      <div className="flex items-center" onClick={() => router.push(item.key)}>
        <span className="mr-2">{item.icon}</span>
        <span>{item.label}</span>
      </div>
    ),
  }));

  // 处理导航点击
  const handleNavClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  return (
    <AntHeader className="bg-white dark:bg-gray-800 px-4 sm:px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 sticky top-0 z-10">
      {/* 左侧区域：Logo和标题 */}
      <Flex align="center" className="mr-4">
        <Link href="/" className="flex items-center">
          <img
            src="/images/logo.svg"
            alt="火石设计"
            className="h-8 w-8 mr-2"
          />
          <Title level={4} className="m-0 text-gray-800 dark:text-gray-100 hidden sm:block">
            火石设计 HuoS
          </Title>
        </Link>
      </Flex>

      {/* 中间区域：顶部导航菜单（桌面设备） */}
      <div className="flex-1 hidden md:block">
        <Menu
          mode="horizontal"
          selectedKeys={getSelectedKeys()}
          items={menuItems}
          onClick={handleNavClick}
          className="border-none nav-menu"
          style={{ background: 'transparent' }}
          theme={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
        />
      </div>

      {/* 右侧区域：移动设备菜单按钮、搜索和主题切换 */}
      <Flex align="center" gap="small">
        {/* 移动设备上的菜单按钮 */}
        <div className="md:hidden mr-2">
          <Dropdown
            menu={{ items: mobileMenuItems }}
            trigger={['click']}
            open={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
            placement="bottomRight"
          >
            <Button
              icon={<MenuOutlined />}
              type="text"
              className="flex items-center justify-center"
            />
          </Dropdown>
        </div>

        <GlobalSearch className="mr-2 hidden sm:block" />
        <ThemeToggle />
      </Flex>
    </AntHeader>
  );
};

export default Header; 