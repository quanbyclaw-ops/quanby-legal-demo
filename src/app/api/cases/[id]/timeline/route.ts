// Quanby Case Management Platform – Case Timeline API
// GET /api/cases/[id]/timeline – list timeline events
// POST /api/cases/[id]/timeline – add new event

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { TimelineEventType } from '@prisma/client'

const CreateTimelineSchema = z.object({
  eventType: z.nativeEnum(TimelineEventType).default('NOTE_ADDED'),
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    const { id } = await params

    const events = await prisma.caseTimeline.findMany({
      where: { caseId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true, role: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: events })
  } catch (error) {
    console.error('[GET /api/cases/[id]/timeline]', error)
    return NextResponse.json({ success: false, error: { message: 'Internal server error' } }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
    if (!dbUser) {
      return NextResponse.json({ success: false, error: { message: 'User not found' } }, { status: 404 })
    }

    const { id } = await params

    const caseExists = await prisma.case.findUnique({ where: { id }, select: { id: true } })
    if (!caseExists) {
      return NextResponse.json({ success: false, error: { message: 'Case not found' } }, { status: 404 })
    }

    const body = await request.json()
    const parsed = CreateTimelineSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { message: 'Validation failed', details: parsed.error.flatten() } },
        { status: 400 }
      )
    }

    const event = await prisma.caseTimeline.create({
      data: {
        caseId: id,
        eventType: parsed.data.eventType,
        title: parsed.data.title,
        description: parsed.data.description,
        metadata: parsed.data.metadata as never,
        createdById: dbUser.id,
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true, role: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: event }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/cases/[id]/timeline]', error)
    return NextResponse.json({ success: false, error: { message: 'Internal server error' } }, { status: 500 })
  }
}
