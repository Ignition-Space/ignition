'use client';

import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';

// 自定义事件名称
export const THEME_CHANGE_EVENT = 'theme-change';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  // 检测当前系统主题偏好
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // 检查是否有保存的主题偏好
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // 如果没有保存的主题，检查系统偏好
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      setDarkMode(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches);
        document.documentElement.classList.toggle('dark', e.matches);

        // 发布主题变化事件
        const event = new CustomEvent(THEME_CHANGE_EVENT, {
          detail: { isDarkMode: e.matches },
        });
        window.dispatchEvent(event);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');

    // 发布主题变化事件
    const event = new CustomEvent(THEME_CHANGE_EVENT, {
      detail: { isDarkMode: newDarkMode },
    });
    window.dispatchEvent(event);
  };

  return (
    <Button
      type="text"
      shape="circle"
      icon={darkMode ? <BulbOutlined /> : <BulbFilled />}
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
      aria-label={darkMode ? '切换到亮色模式' : '切换到深色模式'}
    />
  );
};

export default ThemeToggle;
