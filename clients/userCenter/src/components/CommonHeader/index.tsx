import React from 'react';
import { Layout, Avatar, Space, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';

const { Header } = Layout;

const CommonHeader: React.FC = () => {
  const { user } = useAtomValue(userAtom);
  const router = useRouter();

  const handleLogout = () => {
    // 实际项目中应该调用登出API
    router.push('/login');
  };

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人信息',
      icon: <UserOutlined />,
    },
    {
      key: 'divider',
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Header className="common-header">
      <div className="logo">
        <span>用户中心</span>
      </div>
      <div className="user-info">
        <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
          <Space className="cursor-pointer">
            <span className="username">{user?.username || '管理员'}</span>
            <Avatar
              icon={<UserOutlined />}
              src={user?.avatar}
              className="bg-blue-600"
            />
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default CommonHeader;
