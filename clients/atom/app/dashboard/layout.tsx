'use client';

import {
  GithubFilled,
  InfoCircleFilled,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
} from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import { ProLayout, SettingDrawer } from '@ant-design/pro-components';
import { Divider, Input } from 'antd';
import React, { useState } from 'react';
import defaultProps from '@/components/dashboard/_defaultProps';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    layout: 'top',
    splitMenus: true,
  });

  const [menuPath, setMenuPath] = useState('siteList');

  return (
    <div
      id="pro-layout"
      style={{
        height: '100vh',
      }}
    >
      <ProLayout
        {...defaultProps}
        location={{
          pathname: menuPath,
        }}
        siderMenuType="group"
        menu={{
          collapsedShowGroupTitle: true,
        }}
        avatarProps={{
          src: '/profile.jpeg',
          size: 'small',
          title: '言萧凡',
        }}
        actionsRender={(props) => {
          if (props.isMobile) return [];
          return [
            props.layout !== 'side' && document.body.clientWidth > 1400 ? (
              <div
                key="SearchOutlined"
                aria-hidden
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginInlineEnd: 24,
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <Input
                  style={{
                    borderRadius: 4,
                    marginInlineEnd: 12,
                    backgroundColor: 'rgba(0,0,0,0.03)',
                  }}
                  prefix={
                    <SearchOutlined
                      style={{
                        color: 'rgba(0, 0, 0, 0.15)',
                      }}
                    />
                  }
                  placeholder="搜索方案"
                  bordered={false}
                />
                <PlusCircleFilled
                  style={{
                    color: 'var(--ant-primary-color)',
                    fontSize: 24,
                  }}
                />
              </div>
            ) : undefined,
            <InfoCircleFilled key="InfoCircleFilled" />,
            <QuestionCircleFilled key="QuestionCircleFilled" />,
            <GithubFilled
              key="GithubFilled"
              onClick={() => window.open('https://github.com/Ignition-Space')}
            />,
          ];
        }}
        headerTitleRender={(logo, title, _) => {
          const defaultDom = (
            <a>
              {logo}
              {title}
            </a>
          );
          if (document.body.clientWidth < 1400) {
            return defaultDom;
          }
          if (_.isMobile) return defaultDom;
          return (
            <>
              {defaultDom}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Divider
                  style={{
                    height: '1.5em',
                  }}
                  type="vertical"
                />
              </div>
            </>
          );
        }}
        menuFooterRender={(props) => {
          if (props?.collapsed) return undefined;
          return (
            <div
              style={{
                textAlign: 'center',
                paddingBlockStart: 12,
              }}
            >
              <div>© 2021 Made with love</div>
              <div>by HuoS</div>
            </div>
          );
        }}
        contentStyle={{ margin: 0, padding: '20px' }}
        onMenuHeaderClick={(e) => console.log(e)}
        menuItemRender={(item, dom) => (
          <div
            onClick={() => {
              setMenuPath(item.key || '/');
              item.path && router.push(item.path);
            }}
          >
            {dom}
          </div>
        )}
        {...settings}
      >
        {children}
        <SettingDrawer
          pathname={pathname}
          enableDarkTheme
          getContainer={() => document.getElementById('pro-layout')}
          settings={settings}
          onSettingChange={(changeSetting) => {
            setSetting(changeSetting);
          }}
          disableUrlParams={false}
        />
      </ProLayout>
    </div>
  );
} 