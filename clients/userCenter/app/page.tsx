'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 立即跳转到dashboard页面
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-pulse text-lg text-gray-500">正在加载...</div>
      </div>
    </div>
  );
}
