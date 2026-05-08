import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/login';
  const isRoot = pathname === '/';
  const isDashboard = pathname.startsWith('/dashboard');

  if (isRoot) {
    return NextResponse.redirect(new URL(token ? '/dashboard' : '/login', request.url));
  }

  if (isDashboard && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard', '/dashboard/:path*', '/login'],
};
