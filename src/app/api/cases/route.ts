// Quanby Legal Platform – Cases API Route
// GET /api/cases – list cases with filters
// POST /api/cases – create new case

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateCaseNumber } from '@/lib/utils'
import type { CaseFilters } from '@/types'
import { z } from 'zod'
import { CaseType, CaseStatus, CasePriority, CourtLevel } from '@prisma/client'

const CreateCaseSchema = z.object({
  title: z.string().min(5).max(500),
  type: z.nativeEnum(CaseType),
  priority: z.nativeEnum(CasePriority).default('MEDIUM'),
  clientId: z.string().cuid(),
  assignedLawyerId: z.string().cuid().optional(),
  description: z.string().optional(),
  causeOfAction: z.string().optional(),
  reliefSought: z.string().optional(),
  factualBackground: z.string().optional(),
  courtLevel: z.nativeEnum(CourtLevel).optional(),
  courtName: z.string().optional(),
  courtBranch: z.string().optional(),
  courtDocket: z.string().optional(),
  judgeAssigned: z.string().optional(),
  dateOfIncident: z.string().datetime().optional(),
  dateOfFiling: z.string().datetime().optional(),
  reglementaryDeadline: z.string().datetime().optional(),
  prescriptionDate: z.string().datetime().optional(),
  nextHearingDate: z.string().datetime().optional(),
  opposingParty: z.string().optional(),
  opposingCounsel: z.string().optional(),
  estimatedValue: z.number().positive().optional(),
  isConfidential: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
})

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') ?? '20'), 100)
    const sortBy = searchParams.get('sortBy') ?? 'updatedAt'
    const sortOrder = (searchParams.get('sortOrder') ?? 'desc') as 'asc' | 'desc'
    const status = searchParams.get('status') as CaseStatus | null
    const type = searchParams.get('type') as CaseType | null
    const priority = searchParams.get('priority') as CasePriority | null
    const search = searchParams.get('search')
    const assignedLawyerId = searchParams.get('assignedLawyerId')
    const clientId = searchParams.get('clientId')

    const where: Record<string, unknown> = {}

    if (status) where.status = status
    if (type) where.type = type
    if (priority) where.priority = priority
    if (assignedLawyerId) where.assignedLawyerId = assignedLawyerId
    if (clientId) where.clientId = clientId
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { caseNumber: { contains: search, mode: 'insensitive' } },
        { courtDocket: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
        include: {
          client: {
            include: {
              user: {
                select: { firstName: true, lastName: true, email: true },
              },
            },
          },
          assignedLawyer: {
            select: { id: true, firstName: true, lastName: true, barNumber: true },
          },
          _count: {
            select: { documents: true, tasks: true, timeline: true },
          },
        },
      }),
      prisma.case.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: cases,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('[GET /api/cases]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    // Get the database user by mock user email
    const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
    if (!dbUser) {
      return NextResponse.json({ success: false, error: { message: 'User not found' } }, { status: 404 })
    }

    const body = await request.json()
    const parsed = CreateCaseSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { message: 'Validation failed', details: parsed.error.flatten() } },
        { status: 400 }
      )
    }

    const data = parsed.data
    const caseNumber = generateCaseNumber(data.type)

    const newCase = await prisma.case.create({
      data: {
        ...data,
        caseNumber,
        createdById: dbUser.id,
        dateOfIncident: data.dateOfIncident ? new Date(data.dateOfIncident) : undefined,
        dateOfFiling: data.dateOfFiling ? new Date(data.dateOfFiling) : undefined,
        reglementaryDeadline: data.reglementaryDeadline ? new Date(data.reglementaryDeadline) : undefined,
        prescriptionDate: data.prescriptionDate ? new Date(data.prescriptionDate) : undefined,
        nextHearingDate: data.nextHearingDate ? new Date(data.nextHearingDate) : undefined,
      },
    })

    // Create initial timeline entry
    await prisma.caseTimeline.create({
      data: {
        caseId: newCase.id,
        eventType: 'CASE_CREATED',
        title: 'Case created and registered',
        description: `Case ${caseNumber} registered by ${dbUser.firstName} ${dbUser.lastName}`,
        createdById: dbUser.id,
      },
    })

    return NextResponse.json({ success: true, data: newCase }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/cases]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}
