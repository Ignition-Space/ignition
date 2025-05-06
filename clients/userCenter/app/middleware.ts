import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 定义需要认证的路径
const protectedRoutes = [
  '/dashboard',
  '/user',
  '/role',
  '/privilege',
  '/resource',
  '/system',
];

// 不需要认证的路径
const publicRoutes = ['/login', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // 检查是否是需要认证的路径
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // 检查是否是公开路径
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // 如果是受保护的路由，但没有token，重定向到登录页
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // 如果已登录，访问登录页，重定向到仪表盘
  if (isPublicRoute && pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// 配置匹配的路由
export const config = {
  matcher: [...protectedRoutes, ...publicRoutes],
};
