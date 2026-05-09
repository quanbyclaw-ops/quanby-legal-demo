// Quanby Case Management Platform – Case Tasks API
// GET /api/cases/[id]/tasks – list tasks
// POST /api/cases/[id]/tasks – create task
// PATCH /api/cases/[id]/tasks – update task (complete, reassign)

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { CasePriority } from '@prisma/client'

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  assignedToId: z.string().cuid().optional(),
  priority: z.nativeEnum(CasePriority).default('MEDIUM'),
})

const UpdateTaskSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(500).optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  assignedToId: z.string().cuid().nullable().optional(),
  priority: z.nativeEnum(CasePriority).optional(),
  isCompleted: z.boolean().optional(),
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

    const tasks = await prisma.caseTask.findMany({
      where: { caseId: id },
      orderBy: [{ isCompleted: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
      include: {
        assignedTo: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: tasks })
  } catch (error) {
    console.error('[GET /api/cases/[id]/tasks]', error)
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
    const parsed = CreateTaskSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { message: 'Validation failed', details: parsed.error.flatten() } },
        { status: 400 }
      )
    }

    const task = await prisma.caseTask.create({
      data: {
        caseId: id,
        title: parsed.data.title,
        description: parsed.data.description,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
        assignedToId: parsed.data.assignedToId,
        priority: parsed.data.priority,
        createdById: dbUser.id,
      },
      include: {
        assignedTo: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    })

    // Add timeline event
    await prisma.caseTimeline.create({
      data: {
        caseId: id,
        eventType: 'NOTE_ADDED',
        title: `Task created: ${task.title}`,
        description: `New task added by ${dbUser.firstName} ${dbUser.lastName}`,
        createdById: dbUser.id,
      },
    })

    return NextResponse.json({ success: true, data: task }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/cases/[id]/tasks]', error)
    return NextResponse.json({ success: false, error: { message: 'Internal server error' } }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
    if (!dbUser) {
      return NextResponse.json({ success: false, error: { message: 'User not found' } }, { status: 404 })
    }

    const { id: caseId } = await params
    const body = await request.json()
    const parsed = UpdateTaskSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { message: 'Validation failed', details: parsed.error.flatten() } },
        { status: 400 }
      )
    }

    const { id: taskId, isCompleted, dueDate, ...rest } = parsed.data

    const task = await prisma.caseTask.update({
      where: { id: taskId, caseId },
      data: {
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : dueDate === null ? null : undefined,
        isCompleted: isCompleted ?? undefined,
        completedAt: isCompleted === true ? new Date() : isCompleted === false ? null : undefined,
      },
      include: {
        assignedTo: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    })

    if (isCompleted === true) {
      await prisma.caseTimeline.create({
        data: {
          caseId,
          eventType: 'TASK_COMPLETED',
          title: `Task completed: ${task.title}`,
          description: `Task marked complete by ${dbUser.firstName} ${dbUser.lastName}`,
          createdById: dbUser.id,
        },
      })
    }

    return NextResponse.json({ success: true, data: task })
  } catch (error) {
    console.error('[PATCH /api/cases/[id]/tasks]', error)
    return NextResponse.json({ success: false, error: { message: 'Internal server error' } }, { status: 500 })
  }
}
