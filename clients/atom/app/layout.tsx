import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AntdRegistry } from '@/lib/AntdRegistry';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '火石组件库',
  description: '火石工程化平台 - 原子组件库',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
} 