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
const publicRoutes = ['/login', '/', '/api/auth/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查cookie中的token
  const cookieToken = request.cookies.get('token')?.value;

  // 同时也检查localStorage的token (通过请求头)
  const headerToken =
    request.headers.get('x-auth-token') ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  // 使用任一有效token
  const token = cookieToken || headerToken;

  // 检查是否是需要认证的路径
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // 检查是否是公开路径
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // 检查是否是来自API的token过期响应
  const isExpiredTokenResponse =
    request.headers.get('x-token-expired') === 'true';

  // 如果API返回token过期
  if (isExpiredTokenResponse) {
    // 清除cookie中的token
    const response = NextResponse.redirect(
      new URL('/login?expired=true', request.url),
    );
    response.cookies.delete('token');
    return response;
  }

  // 如果是受保护的路由，但没有token，重定向到登录页
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // 如果已登录，访问登录页，重定向到仪表盘
  if (isPublicRoute && pathname === '/login' && token) {
    // 尝试验证token有效性，如果token有问题，不重定向
    try {
      // Token简单有效性检查 (格式检查)
      const isValidToken = token.length > 20; // JWT通常比较长

      if (isValidToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      // 如果token验证失败，删除无效token
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
  }

  // 对所有响应添加安全相关的头信息
  const response = NextResponse.next();

  // 安全相关头
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()',
  );

  return response;
}

// 配置匹配的路由
export const config = {
  matcher: [
    /*
     * 匹配所有的路径除了:
     * - api 路由 (除了/api/auth/login)
     * - _next/static (静态文件)
     * - _next/image (图片优化API)
     * - favicon.ico (浏览器图标)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/(?!auth/login)).*)',
  ],
};
