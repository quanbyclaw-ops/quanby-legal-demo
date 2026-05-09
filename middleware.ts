// Quanby Legal Platform – Mock Auth Middleware
// Replaces Clerk middleware for demo mode.
// Sets a mock user cookie and adds standard security headers.
// RA 10173 / NIST SP 800-53: In production, replace with a real IdP middleware.

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { MOCK_USER_COOKIE, DEMO_USERS } from '@/lib/auth'

// ─── Public routes (no session required) ──────────────────────────────────────
const PUBLIC_PATHS = [
  '/',
  '/sign-in',
  '/sign-up',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/api/webhooks',
]

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

// ─── Admin-only paths ──────────────────────────────────────────────────────────
const ADMIN_PATHS = ['/admin', '/api/admin']

function isAdminPath(pathname: string): boolean {
  return ADMIN_PATHS.some((p) => pathname.startsWith(p))
}

// ─── Middleware ────────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths through immediately
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // ── Demo user resolution ────────────────────────────────────────────────────
  // Priority: ?user=<id> query param → cookie → default (user 1)
  const url = request.nextUrl.clone()
  const queryUserId = url.searchParams.get('user')
  const cookieUserId = request.cookies.get(MOCK_USER_COOKIE)?.value

  let resolvedUserId = cookieUserId ?? '1'

  if (queryUserId && DEMO_USERS.find((u) => u.id === queryUserId)) {
    resolvedUserId = queryUserId
    // Remove ?user from URL to keep it clean after setting cookie
    url.searchParams.delete('user')
  }

  const resolvedUser = DEMO_USERS.find((u) => u.id === resolvedUserId) ?? DEMO_USERS[0]

  // ── Admin route protection ──────────────────────────────────────────────────
  if (isAdminPath(pathname) && resolvedUser.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // ── Build response ──────────────────────────────────────────────────────────
  const response = NextResponse.next()

  // Set (or refresh) the mock user cookie
  response.cookies.set(MOCK_USER_COOKIE, resolvedUser.id, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
  })

  // ── Security headers ────────────────────────────────────────────────────────
  response.headers.set('X-Auth-User-Id', resolvedUser.id)
  response.headers.set('X-Auth-User-Role', resolvedUser.role)
  response.headers.set('X-Request-ID', crypto.randomUUID())
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Content-Security-Policy (relaxed for demo; tighten for production)
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
    ].join('; ')
  )

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Static assets (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|css|js)).*)',
  ],
}
