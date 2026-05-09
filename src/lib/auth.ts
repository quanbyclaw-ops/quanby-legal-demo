// Quanby Legal Platform – Mock Authentication Utilities
// Replaces Clerk for demo/development mode.
// RA 10173 note: In production, replace with a compliant IdP (e.g., Keycloak + TOTP).

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Role } from '@prisma/client'

// ─── Demo Users ────────────────────────────────────────────────────────────────

export interface MockUser {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  role: Role
  avatar: string
  barNumber?: string
}

export const DEMO_USERS: MockUser[] = [
  {
    id: '1',
    name: 'Atty. Maria Santos',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria@quanbylegal.com',
    role: 'ADMIN' as Role,
    avatar: '/avatars/maria.png',
    barNumber: '2015-01234',
  },
  {
    id: '2',
    name: 'Atty. Juan dela Cruz',
    firstName: 'Juan',
    lastName: 'dela Cruz',
    email: 'juan@quanbylegal.com',
    role: 'LAWYER' as Role,
    avatar: '/avatars/juan.png',
    barNumber: '2018-05678',
  },
  {
    id: '3',
    name: 'Ana Reyes',
    firstName: 'Ana',
    lastName: 'Reyes',
    email: 'ana@quanbylegal.com',
    role: 'PARALEGAL' as Role,
    avatar: '/avatars/ana.png',
  },
  {
    id: '4',
    name: 'Pedro Garcia',
    firstName: 'Pedro',
    lastName: 'Garcia',
    email: 'pedro@client.com',
    role: 'CLIENT' as Role,
    avatar: '/avatars/pedro.png',
  },
]

export const MOCK_USER_COOKIE = 'ql_demo_user'

// ─── User resolution ──────────────────────────────────────────────────────────

/**
 * Resolves the current demo user from:
 * 1. `?user=<id>` query param (overrides cookie, sets cookie)
 * 2. `ql_demo_user` cookie
 * 3. Falls back to user ID "1" (Admin)
 */
export async function getCurrentUser(request?: NextRequest): Promise<MockUser> {
  // From request (API routes / middleware)
  if (request) {
    const url = new URL(request.url)
    const queryId = url.searchParams.get('user')
    if (queryId) {
      const found = DEMO_USERS.find((u) => u.id === queryId)
      if (found) return found
    }
    const cookieId = request.cookies.get(MOCK_USER_COOKIE)?.value
    if (cookieId) {
      const found = DEMO_USERS.find((u) => u.id === cookieId)
      if (found) return found
    }
    return DEMO_USERS[0]
  }

  // From server component (next/headers cookies)
  try {
    const cookieStore = await cookies()
    const cookieId = cookieStore.get(MOCK_USER_COOKIE)?.value
    if (cookieId) {
      const found = DEMO_USERS.find((u) => u.id === cookieId)
      if (found) return found
    }
  } catch {
    // cookies() may throw outside request context
  }

  return DEMO_USERS[0]
}

/**
 * Returns the current user or null if no valid session.
 * In demo mode, always returns a user (never null).
 */
export async function getOptionalUser(request?: NextRequest): Promise<MockUser | null> {
  return getCurrentUser(request)
}

/**
 * Requires authentication. In demo mode, always succeeds.
 * In production, replace with a real auth check that throws/redirects.
 */
export async function requireAuth(
  request?: NextRequest,
  allowedRoles?: Role[]
): Promise<MockUser> {
  const user = await getCurrentUser(request)

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      throw new AuthorizationError(`Role '${user.role}' is not authorized for this resource.`)
    }
  }

  return user
}

/**
 * Checks if the given user has at least one of the required roles.
 */
export function hasRole(user: MockUser, roles: Role | Role[]): boolean {
  const roleArray = Array.isArray(roles) ? roles : [roles]
  return roleArray.includes(user.role)
}

/**
 * Checks if the user is a lawyer or admin (i.e., legal professional).
 */
export function isLegalProfessional(user: MockUser): boolean {
  return hasRole(user, ['ADMIN', 'LAWYER'])
}

/**
 * Sets the demo user cookie on a response.
 * Used by the middleware and the ?user= switcher.
 */
export function setUserCookie(response: NextResponse, userId: string): NextResponse {
  response.cookies.set(MOCK_USER_COOKIE, userId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
  })
  return response
}

/**
 * Clears the demo user cookie.
 */
export function clearUserCookie(response: NextResponse): NextResponse {
  response.cookies.delete(MOCK_USER_COOKIE)
  return response
}

// ─── Error types ──────────────────────────────────────────────────────────────

export class AuthenticationError extends Error {
  constructor(message = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'Insufficient permissions') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

// ─── API response helpers ──────────────────────────────────────────────────────

export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json(
    { success: false, error: { message, code: 'AUTH_REQUIRED' } },
    { status: 401 }
  )
}

export function forbiddenResponse(message = 'Forbidden') {
  return NextResponse.json(
    { success: false, error: { message, code: 'FORBIDDEN' } },
    { status: 403 }
  )
}
