import './globals.css';
import type { Metadata } from 'next';
import { AntdRegistry } from './providers';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: '火石设计 HuoS - 基于接口管理的低代码生成器',
  description: '火石设计是一套基于接口管理的低代码生成器，帮助开发者高效构建应用',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <AntdRegistry>
          <MainLayout>
            {children}
          </MainLayout>
        </AntdRegistry>
      </body>
    </html>
  );
} 