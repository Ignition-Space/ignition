import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 对于组件库，通常不需要特殊的身份验证
  // 这里只是添加了一个简单的中间件示例，可以根据需要扩展

  // 例如，如果需要在某些情况下重定向
  // const { pathname } = request.nextUrl;
  // if (pathname === '/old-path') {
  //   return NextResponse.redirect(new URL('/new-path', request.url));
  // }

  return NextResponse.next();
}

// 配置匹配的路由
export const config = {
  matcher: [
    // 匹配所有路由
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 