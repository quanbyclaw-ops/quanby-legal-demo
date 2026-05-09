// Quanby Legal Platform – Single Contract CRUD Route
// GET /api/contracts/[id] – Full contract with analyses, chats, linked case
// PATCH /api/contracts/[id] – Update contract metadata/status
// DELETE /api/contracts/[id] – Remove contract

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { ContractStatus, ContractType } from '@prisma/client'

interface RouteContext {
  params: Promise<{ id: string }>
}

const UpdateContractSchema = z.object({
  title: z.string().min(3).max(500).optional(),
  type: z.nativeEnum(ContractType).optional(),
  status: z.nativeEnum(ContractStatus).optional(),
  partyA: z.string().min(2).optional(),
  partyB: z.string().min(2).optional(),
  partyAAddress: z.string().optional(),
  partyBAddress: z.string().optional(),
  effectiveDate: z.string().datetime().optional().nullable(),
  expirationDate: z.string().datetime().optional().nullable(),
  contractValue: z.number().nonnegative().optional().nullable(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    const { id } = await params

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
        },
        chats: {
          orderBy: { createdAt: 'asc' },
        },
        uploadedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        linkedCase: {
          select: { id: true, caseNumber: true, title: true, status: true },
        },
        _count: {
          select: { analyses: true, chats: true },
        },
      },
    })

    if (!contract) {
      return NextResponse.json(
        { success: false, error: { message: 'Contract not found' } },
        { status: 404 }
      )
    }

    // Attach latestAnalysis for convenience
    const latestAnalysis = contract.analyses[0] ?? null

    return NextResponse.json({
      success: true,
      data: { ...contract, latestAnalysis },
    })
  } catch (error) {
    console.error('[GET /api/contracts/[id]]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.contract.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: { message: 'Contract not found' } },
        { status: 404 }
      )
    }

    const body = await request.json()
    const parsed = UpdateContractSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { message: 'Validation failed', details: parsed.error.flatten() } },
        { status: 400 }
      )
    }

    const data = parsed.data
    const updated = await prisma.contract.update({
      where: { id },
      data: {
        ...data,
        effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : data.effectiveDate === null ? null : undefined,
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : data.expirationDate === null ? null : undefined,
      },
      include: {
        analyses: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('[PATCH /api/contracts/[id]]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    // Only admins and lawyers can delete contracts
    if (!['ADMIN', 'LAWYER', 'SUPERADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: { message: 'Forbidden – insufficient role' } },
        { status: 403 }
      )
    }

    const { id } = await params

    const existing = await prisma.contract.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: { message: 'Contract not found' } },
        { status: 404 }
      )
    }

    await prisma.contract.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Contract deleted successfully' })
  } catch (error) {
    console.error('[DELETE /api/contracts/[id]]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}
