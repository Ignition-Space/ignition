import Link from 'next/link';
import { Button } from 'antd';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="max-w-4xl w-full space-y-6 text-center">
        <h1 className="text-4xl font-bold">火石工程化平台 - 用户中心</h1>
        <p className="text-xl">一站式用户管理与权限控制系统</p>
        <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
          <Link href="/login">
            <Button type="primary" size="large">
              立即登录
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="large">进入仪表盘</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
