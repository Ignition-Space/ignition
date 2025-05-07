import './globals.css';
import type { Metadata } from 'next';
import { AntdRegistry } from './providers';

export const metadata: Metadata = {
  title: 'Atom - 低代码生成工具',
  description: '基于接口管理的低代码生成器',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
} 