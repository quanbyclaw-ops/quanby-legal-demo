// Quanby Case Management Platform – Single Case CRUD API
// GET /api/cases/[id] – Full case with relations
// PATCH /api/cases/[id] – Update case fields
// DELETE /api/cases/[id] – Soft delete (archive)

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { CaseType, CaseStatus, CasePriority, CourtLevel } from '@prisma/client'

const UpdateCaseSchema = z.object({
  title: z.string().min(5).max(500).optional(),
  type: z.nativeEnum(CaseType).optional(),
  status: z.nativeEnum(CaseStatus).optional(),
  priority: z.nativeEnum(CasePriority).optional(),
  assignedLawyerId: z.string().nullable().optional(),
  description: z.string().optional(),
  causeOfAction: z.string().optional(),
  reliefSought: z.string().optional(),
  factualBackground: z.string().optional(),
  courtLevel: z.nativeEnum(CourtLevel).nullable().optional(),
  courtName: z.string().optional(),
  courtBranch: z.string().optional(),
  courtDocket: z.string().optional(),
  judgeAssigned: z.string().optional(),
  dateOfIncident: z.string().datetime().nullable().optional(),
  dateOfFiling: z.string().datetime().nullable().optional(),
  reglementaryDeadline: z.string().datetime().nullable().optional(),
  prescriptionDate: z.string().datetime().nullable().optional(),
  nextHearingDate: z.string().datetime().nullable().optional(),
  opposingParty: z.string().optional(),
  opposingCounsel: z.string().optional(),
  estimatedValue: z.number().positive().nullable().optional(),
  isConfidential: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
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

    const caseData = await prisma.case.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            user: true,
          },
        },
        assignedLawyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            barNumber: true,
            specializations: true,
            avatarUrl: true,
            _count: { select: { assignedCases: true } },
          },
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        timeline: {
          orderBy: { createdAt: 'desc' },
          include: {
            createdBy: {
              select: { id: true, firstName: true, lastName: true, avatarUrl: true },
            },
          },
        },
        tasks: {
          orderBy: [{ isCompleted: 'asc' }, { dueDate: 'asc' }],
          include: {
            assignedTo: {
              select: { id: true, firstName: true, lastName: true, avatarUrl: true },
            },
            createdBy: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
        contracts: {
          orderBy: { createdAt: 'desc' },
          include: {
            analyses: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: {
                overallRiskScore: true,
                riskLevel: true,
                status: true,
                analysisType: true,
              },
            },
          },
        },
        _count: {
          select: { documents: true, tasks: true, timeline: true, contracts: true },
        },
      },
    })

    if (!caseData) {
      return NextResponse.json({ success: false, error: { message: 'Case not found' } }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: caseData })
  } catch (error) {
    console.error('[GET /api/cases/[id]]', error)
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

    const { id } = await params
    const existing = await prisma.case.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: { message: 'Case not found' } }, { status: 404 })
    }

    const body = await request.json()
    const parsed = UpdateCaseSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { message: 'Validation failed', details: parsed.error.flatten() } },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Build timeline events for significant changes
    const timelineEvents: Array<{ eventType: string; title: string; description: string }> = []

    if (data.status && data.status !== existing.status) {
      timelineEvents.push({
        eventType: 'STATUS_CHANGED',
        title: `Status changed to ${data.status}`,
        description: `Status updated from ${existing.status} to ${data.status} by ${dbUser.firstName} ${dbUser.lastName}`,
      })
    }

    if (data.assignedLawyerId !== undefined && data.assignedLawyerId !== existing.assignedLawyerId) {
      const lawyer = data.assignedLawyerId
        ? await prisma.user.findUnique({ where: { id: data.assignedLawyerId }, select: { firstName: true, lastName: true } })
        : null
      timelineEvents.push({
        eventType: 'LAWYER_ASSIGNED',
        title: lawyer ? `Assigned to Atty. ${lawyer.firstName} ${lawyer.lastName}` : 'Lawyer unassigned',
        description: lawyer
          ? `Case assigned to Atty. ${lawyer.firstName} ${lawyer.lastName}`
          : 'Lawyer assignment removed',
      })
    }

    if (data.nextHearingDate && data.nextHearingDate !== existing.nextHearingDate?.toISOString()) {
      timelineEvents.push({
        eventType: 'HEARING_SCHEDULED',
        title: 'Hearing date scheduled',
        description: `Next hearing set to ${new Date(data.nextHearingDate).toLocaleDateString('en-PH')}`,
      })
    }

    // Update case
    const updated = await prisma.case.update({
      where: { id },
      data: {
        ...data,
        dateOfIncident: data.dateOfIncident ? new Date(data.dateOfIncident) : data.dateOfIncident === null ? null : undefined,
        dateOfFiling: data.dateOfFiling ? new Date(data.dateOfFiling) : data.dateOfFiling === null ? null : undefined,
        reglementaryDeadline: data.reglementaryDeadline ? new Date(data.reglementaryDeadline) : data.reglementaryDeadline === null ? null : undefined,
        prescriptionDate: data.prescriptionDate ? new Date(data.prescriptionDate) : data.prescriptionDate === null ? null : undefined,
        nextHearingDate: data.nextHearingDate ? new Date(data.nextHearingDate) : data.nextHearingDate === null ? null : undefined,
      },
      include: {
        client: { include: { user: true } },
        assignedLawyer: { select: { id: true, firstName: true, lastName: true, barNumber: true } },
      },
    })

    // Create timeline entries for changes
    if (timelineEvents.length > 0) {
      await prisma.caseTimeline.createMany({
        data: timelineEvents.map((ev) => ({
          caseId: id,
          eventType: ev.eventType as never,
          title: ev.title,
          description: ev.description,
          createdById: dbUser.id,
        })),
      })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('[PATCH /api/cases/[id]]', error)
    return NextResponse.json({ success: false, error: { message: 'Internal server error' } }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
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
    const existing = await prisma.case.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: { message: 'Case not found' } }, { status: 404 })
    }

    // Soft delete: archive the case
    await prisma.case.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
        closedAt: new Date(),
      },
    })

    await prisma.caseTimeline.create({
      data: {
        caseId: id,
        eventType: 'STATUS_CHANGED',
        title: 'Case archived',
        description: `Case archived by ${dbUser.firstName} ${dbUser.lastName}`,
        createdById: dbUser.id,
      },
    })

    return NextResponse.json({ success: true, message: 'Case archived successfully' })
  } catch (error) {
    console.error('[DELETE /api/cases/[id]]', error)
    return NextResponse.json({ success: false, error: { message: 'Internal server error' } }, { status: 500 })
  }
}
