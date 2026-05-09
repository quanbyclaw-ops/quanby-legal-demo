// Quanby Case Management Platform – Contracts API Route
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { ContractType, ContractStatus } from '@prisma/client'

const CreateContractSchema = z.object({
  title: z.string().min(3).max(500),
  type: z.nativeEnum(ContractType),
  partyA: z.string().min(2),
  partyB: z.string().min(2),
  partyAAddress: z.string().optional(),
  partyBAddress: z.string().optional(),
  executionDate: z.string().datetime().optional(),
  effectiveDate: z.string().datetime().optional(),
  expirationDate: z.string().datetime().optional(),
  contractValue: z.number().nonnegative().optional(),
  currency: z.string().default('PHP'),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  jurisdiction: z.string().default('Philippines'),
  governingLaw: z.string().default('Philippine Law'),
})

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') ?? '20'), 100)
    const type = searchParams.get('type') as ContractType | null
    const status = searchParams.get('status') as ContractStatus | null
    const search = searchParams.get('search')
    const expiringIn = searchParams.get('expiringIn')

    const where: Record<string, unknown> = {}
    if (type) where.type = type
    if (status) where.status = status
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { partyA: { contains: search, mode: 'insensitive' } },
        { partyB: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (expiringIn) {
      const days = parseInt(expiringIn)
      where.expirationDate = {
        lte: new Date(Date.now() + days * 86400000),
        gte: new Date(),
      }
    }

    const [contracts, total] = await Promise.all([
      prisma.contract.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
        include: {
          analyses: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { id: true, riskScore: true, riskLevel: true, createdAt: true },
          },
          _count: { select: { analyses: true } },
        },
      }),
      prisma.contract.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: contracts,
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
    console.error('[GET /api/contracts]', error)
    return NextResponse.json({ success: false, error: { message: 'Internal server error' } }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 })

    const body = await request.json()
    const parsed = CreateContractSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { message: 'Validation failed', details: parsed.error.flatten() } },
        { status: 400 }
      )
    }

    const data = parsed.data
    const contract = await prisma.contract.create({
      data: {
        ...data,
        executionDate: data.executionDate ? new Date(data.executionDate) : undefined,
        effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : undefined,
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined,
        contractValue: data.contractValue !== undefined ? data.contractValue : undefined,
        status: ContractStatus.UPLOADED,
      },
    })

    return NextResponse.json({ success: true, data: contract }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/contracts]', error)
    return NextResponse.json({ success: false, error: { message: 'Internal server error' } }, { status: 500 })
  }
}
