import React from 'react';
import { Layout, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import './index.less';

const { Header } = Layout;

const CommonHeader: React.FC = () => {
  const { user } = useAtomValue(userAtom);

  return (
    <Header className="common-header">
      <div className="logo">
        <span>IG SPACE USER CENTER</span>
      </div>
      <div className="user-info">
        <Space>
          <span className="username">{user?.username}</span>
          <Avatar icon={<UserOutlined />} src={user?.avatar} />
        </Space>
      </div>
    </Header>
  );
};

export default CommonHeader;
