import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Các route không cần xác thực
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/',
  '/search/results',
  '/news',
]

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Kiểm tra nếu là route công khai
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Nếu không có token và không phải route công khai, chuyển hướng về trang login
  if (!token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('returnUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 