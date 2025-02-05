import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import CommonHeader from '@/components/CommonHeader';
import './BasicLayout.less';

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

const BasicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout className="basic-layout">
      <CommonHeader />
      <Layout>
        <Sider width={200} className="site-layout-sider">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={['system']}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        <Content className="site-layout-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
