// Quanby Case Management Platform – Notifications API Route
// GET: List notifications for current user (with unread count)
// PATCH: Mark as read (single or all)

import { NextRequest, NextResponse } from 'next/server'

// ─── Mock data store (ephemeral per-process in demo) ──────────────────────────

interface Notification {
  id: string
  type: 'deadline' | 'case_update' | 'new_document' | 'task_assigned' | 'contract_analyzed' | 'general'
  title: string
  message: string
  timestamp: string
  createdAt: string
  read: boolean
  userId?: string
  href?: string
}

const MOCK_STORE: Notification[] = [
  {
    id: '1',
    type: 'deadline',
    title: 'Deadline Approaching',
    message: 'QLP-2025-CIV-042 reglementary period ends in 3 days.',
    timestamp: '5m ago',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    href: '/cases',
  },
  {
    id: '2',
    type: 'contract_analyzed',
    title: 'Contract Analysis Complete',
    message: 'Service Agreement v2 analyzed. Risk score: 42 (Medium).',
    timestamp: '1h ago',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    read: false,
    href: '/contracts',
  },
  {
    id: '3',
    type: 'case_update',
    title: 'Case Status Updated',
    message: 'QLP-2025-LAB-018 moved to Awaiting Hearing.',
    timestamp: '2h ago',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    href: '/cases',
  },
  {
    id: '4',
    type: 'new_document',
    title: 'New Document Uploaded',
    message: 'Judicial Affidavit for QLP-2025-FAM-009 uploaded.',
    timestamp: '4h ago',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: true,
    href: '/documents',
  },
  {
    id: '5',
    type: 'task_assigned',
    title: 'Task Assigned to You',
    message: 'Draft memorandum on appeal for QLP-2025-CIV-033. Due: June 20, 2025.',
    timestamp: '1d ago',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    href: '/cases',
  },
]

// ─── GET /api/notifications ────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') ?? '20', 10)
    const page  = parseInt(searchParams.get('page')  ?? '1', 10)

    let notifications = [...MOCK_STORE]
    if (unreadOnly) {
      notifications = notifications.filter((n) => !n.read)
    }

    const total       = notifications.length
    const unreadCount = MOCK_STORE.filter((n) => !n.read).length
    const start       = (page - 1) * limit
    const items       = notifications.slice(start, start + limit)

    return NextResponse.json({
      success: true,
      data: {
        notifications: items,
        unreadCount,
        pagination: {
          page,
          pageSize: limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: start + limit < total,
          hasPrev: page > 1,
        },
      },
    })
  } catch (err) {
    console.error('[GET /api/notifications]', err)
    return NextResponse.json({ success: false, error: { message: 'Internal server error' } }, { status: 500 })
  }
}

// ─── PATCH /api/notifications ─────────────────────────────────────────────────
// Body: { id?: string; all?: boolean }
// - { id: "1" }     → mark single notification as read
// - { all: true }   → mark all as read

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as { id?: string; all?: boolean }

    if (body.all === true) {
      for (const n of MOCK_STORE) {
        n.read = true
      }
      return NextResponse.json({ success: true, message: 'All notifications marked as read' })
    }

    if (body.id) {
      const notification = MOCK_STORE.find((n) => n.id === body.id)
      if (!notification) {
        return NextResponse.json({ success: false, error: { message: 'Notification not found' } }, { status: 404 })
      }
      notification.read = true
      return NextResponse.json({ success: true, data: notification })
    }

    return NextResponse.json(
      { success: false, error: { message: 'Provide either { id } or { all: true }' } },
      { status: 400 }
    )
  } catch (err) {
    console.error('[PATCH /api/notifications]', err)
    return NextResponse.json({ success: false, error: { message: 'Internal server error' } }, { status: 500 })
  }
}
