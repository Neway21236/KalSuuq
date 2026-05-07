import { NextResponse, NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

/**
 * Risk #6 Fix: JWT-verified middleware
 * Replaces static token checks with proper JWT verification + role-based access.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin') && !pathname.includes('/login')
  const isPortalRoute = pathname.startsWith('/portal') && !pathname.includes('/login')

  if (!isAdminRoute && !isPortalRoute) {
    return NextResponse.next()
  }

  const token = request.cookies.get('kalsuq-auth-token')?.value

  if (!token) {
    const loginUrl = new URL(isAdminRoute ? '/admin/login' : '/portal/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Verify JWT and check role
  const payload = await verifyToken(token)
  
  if (!payload) {
    // Token expired or tampered — force re-login
    const loginUrl = new URL(isAdminRoute ? '/admin/login' : '/portal/login', request.url)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('kalsuq-auth-token')
    return response
  }

  // Role-based access control
  if (isAdminRoute && payload.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/portal/login', request.url))
  }

  if (isPortalRoute && payload.role !== 'PARTNER' && payload.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/portal/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*'],
}
