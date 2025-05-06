import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../src/styles/tailwind.css';
import { AntdRegistry } from '@/lib/AntdRegistry';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '用户中心',
  description: '火石工程化平台 - 用户中心',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="overflow-hidden">
      <body className={`${inter.className} m-0 p-0 overflow-hidden`}>
        <AntdRegistry>
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
