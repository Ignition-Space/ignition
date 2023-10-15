/** 左侧导航 **/

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Menu as MenuAntd, MenuProps } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cloneDeep } from 'lodash';

const { Sider } = Layout;

import './index.less';
import ImgLogo from '@/assets/logo.png';

import type { Menu } from '@/models/index.type';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';
import MenuItem from 'antd/lib/menu/MenuItem';
import {
  DeploymentUnitOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';

interface Props {
  data: Menu[]; // 所有的菜单数据
  collapsed: boolean; // 菜单咱开还是收起
}

export default function MenuCom(props: Props): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [chosedKey, setChosedKey] = useState<string[]>([]); // 当前选中
  const [openKeys, setOpenKeys] = useState<string[]>([]); // 当前需要被展开的项

  // 当页面路由跳转时，即location发生改变，则更新选中项
  useEffect(() => {
    const paths = location.pathname.split('/').filter((item) => !!item);
    setChosedKey([location.pathname]);
    setOpenKeys(paths.map((item) => `/${item}`));
  }, [location]);

  // 菜单被选择
  const onSelect = (e: any) => {
    if (e?.key) {
      navigate(e.key);
    }
  };

  // 工具 - 递归将扁平数据转换为层级数据
  const dataToJson = useCallback(
    (one: Menu | undefined, data: Menu[]): Menu[] | undefined => {
      let kids;
      if (!one) {
        // 第1次递归
        kids = data.filter((item: Menu) => !item.parent);
      } else {
        kids = data.filter((item: Menu) => item.parent === one.id);
      }
      kids.forEach((item: Menu) => (item.children = dataToJson(item, data)));
      return kids.length ? kids : undefined;
    },
    [],
  );

  // 构建树结构
  const makeTreeDom = useCallback((data: Menu[]): any => {
    return data.map((item: Menu) => {
      if (item.children) {
        return {
          key: item.url,
          label:
            !item.parent && item.icon ? (
              <span>
                <span>{item.title}</span>
              </span>
            ) : (
              item.title
            ),
          children: makeTreeDom(item.children),
        };
      } else {
        return {
          label: (
            <>
              <span>{item.title}</span>
            </>
          ),
          key: item.url,
        };
      }
    });
  }, []);

  const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
  ) => {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  };

  const items = [
    getItem('系统管理', '/system/admin', <DeploymentUnitOutlined />),
    getItem('角色管理', '/system/role', <DeploymentUnitOutlined />),
    getItem('资源管理', '/system/resource', <UserOutlined />),
    getItem('权限管理', '/system/privilege', <UserOutlined />),
    getItem('用户管理', '/system/user', <UserOutlined />),
  ];

  return (
    <Sider
      width={256}
      className="sider"
      trigger={null}
      collapsible
      collapsed={props.collapsed}
    >
      <div className={props.collapsed ? 'menuLogo hide' : 'menuLogo'}>
        <Link to="/">
          <img src={ImgLogo} />
          <div>IG-User-Center</div>
        </Link>
      </div>
      <MenuAntd
        theme="dark"
        mode="inline"
        items={items}
        selectedKeys={chosedKey}
        {...(props.collapsed ? {} : { openKeys })}
        onOpenChange={(keys: string[]) => setOpenKeys(keys)}
        onSelect={onSelect}
      />
    </Sider>
  );
}
