// Quanby Case Management Platform – Demo Auth: Set Mock User Cookie
// POST /api/auth/set-user – sets the ql_demo_user cookie for demo session

import { NextRequest, NextResponse } from 'next/server'
import { DEMO_USERS, MOCK_USER_COOKIE } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    const user = DEMO_USERS.find((u) => u.id === userId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid demo user ID' } },
        { status: 400 }
      )
    }

    const response = NextResponse.json({ success: true, data: { userId: user.id, role: user.role } })
    response.cookies.set(MOCK_USER_COOKIE, user.id, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
    })

    return response
  } catch (error) {
    console.error('[POST /api/auth/set-user]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(MOCK_USER_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    secure: process.env.NODE_ENV === 'production',
  })
  return response
}
