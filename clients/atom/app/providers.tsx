'use client';

import React, { useState, useEffect } from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, App, Spin } from 'antd';
import { useServerInsertedHTML } from 'next/navigation';
import { Provider as JotaiProvider } from 'jotai';
import zhCN from 'antd/locale/zh_CN';

// 自定义主题配置 - 使用更现代的设计系统
const theme = {
  token: {
    colorPrimary: '#2563eb', // 深蓝色主题
    colorSuccess: '#10b981', // 冷绿色
    colorWarning: '#f59e0b', // 橙黄色
    colorError: '#ef4444', // 鲜红色
    colorInfo: '#3b82f6', // 蓝色
    borderRadius: 6, // 更大的圆角
    wireframe: false, // 更现代的风格
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Button: {
      defaultBorderRadius: 6,
      defaultShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      fontWeight: 500,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    Table: {
      borderRadius: 8,
      headerBg: '#f8fafc',
    },
    Menu: {
      itemHeight: 48,
      itemHoverBg: 'rgba(37, 99, 235, 0.08)',
      itemSelectedBg: 'rgba(37, 99, 235, 0.12)',
      horizontalItemSelectedColor: '#2563eb',
      horizontalItemHoverColor: '#3b82f6',
    },
    Layout: {
      bodyBg: '#f1f5f9',
      headerBg: '#ffffff',
      siderBg: '#1e293b',
    },
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const cache = React.useMemo(() => createCache(), []);
  const isServerInserted = React.useRef<boolean>(false);

  useServerInsertedHTML(() => {
    if (isServerInserted.current) {
      return;
    }
    isServerInserted.current = true;
    return (
      <style
        id="antd"
        dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
      />
    );
  });

  useEffect(() => {
    // 模拟应用初始化加载
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <JotaiProvider>
      <StyleProvider cache={cache}>
        <ConfigProvider locale={zhCN} theme={theme}>
          <App>
            {loading ? (
              <div className="fixed inset-0 flex items-center justify-center bg-slate-50 bg-opacity-90 z-50 dark:bg-slate-900 dark:bg-opacity-90">
                <div className="text-center">
                  <Spin size="large" />
                  <div className="mt-4 text-slate-600 font-medium dark:text-slate-300">
                    系统加载中...
                  </div>
                </div>
              </div>
            ) : null}
            {children}
          </App>
        </ConfigProvider>
      </StyleProvider>
    </JotaiProvider>
  );
}

export { Providers as AntdRegistry }; 