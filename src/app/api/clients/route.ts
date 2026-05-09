// Quanby Legal Platform – Clients API
// GET  /api/clients — List clients with search/filter
// POST /api/clients — Create new client

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// ─── GET ───────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') ?? ''
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const pageSize = Math.min(100, parseInt(searchParams.get('pageSize') ?? '20', 10))
    const eligibilityStatus = searchParams.get('eligibilityStatus')

    const where: Record<string, unknown> = {}

    if (eligibilityStatus) {
      where.eligibilityStatus = eligibilityStatus
    }

    if (search) {
      where.user = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              avatarUrl: true,
            },
          },
          _count: { select: { cases: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.client.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: clients,
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
    console.error('[clients/route] GET error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch clients' } },
      { status: 500 }
    )
  }
}

// ─── POST ──────────────────────────────────────────────────────────────────────

const CreateClientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  middleName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(7),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  civilStatus: z.string().optional(),
  nationality: z.string().default('Filipino'),
  streetAddress: z.string().optional(),
  barangay: z.string().optional(),
  municipality: z.string().optional(),
  province: z.string().optional(),
  region: z.string().optional(),
  zipCode: z.string().optional(),
  monthlyIncome: z.number().nonnegative().optional(),
  occupation: z.string().optional(),
  employer: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = CreateClientSchema.parse(body)

    // Check duplicate email
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: { message: 'A client with this email already exists.' } },
        { status: 409 }
      )
    }

    const user = await prisma.user.create({
      data: {
        clerkId: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: 'CLIENT',
      },
    })

    const client = await prisma.client.create({
      data: {
        userId: user.id,
        middleName: data.middleName,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender,
        civilStatus: data.civilStatus,
        nationality: data.nationality,
        streetAddress: data.streetAddress,
        barangay: data.barangay,
        municipality: data.municipality,
        province: data.province,
        region: data.region,
        zipCode: data.zipCode,
        monthlyIncome: data.monthlyIncome,
        occupation: data.occupation,
        employer: data.employer,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: client }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { message: 'Validation failed', details: error.errors } },
        { status: 400 }
      )
    }
    console.error('[clients/route] POST error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}
