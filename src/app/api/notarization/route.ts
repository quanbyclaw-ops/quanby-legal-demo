// Quanby Case Management Platform – e-Notarization API
// GET /api/notarization – list notarization records
// POST /api/notarization – create notarization request
// PATCH /api/notarization – update notarization status

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { ENotarizationStatus } from '@prisma/client'
import { randomBytes, createHash } from 'crypto'

// ─── Validation schemas ────────────────────────────────────────────────────────

const CreateNotarizationSchema = z.object({
  documentId: z.string().cuid(),
  notaryId: z.string().optional(),
  notaryName: z.string().min(2).max(255).optional(),
  notaryRollNo: z.string().optional(),
  notaryPtrNo: z.string().optional(),
  notaryIbpNo: z.string().optional(),
  notaryMcleNo: z.string().optional(),
})

const UpdateNotarizationSchema = z.object({
  id: z.string().cuid(),
  action: z.enum(['verify', 'notarize', 'reject']),
  notaryName: z.string().optional(),
  notaryRollNo: z.string().optional(),
  notaryPtrNo: z.string().optional(),
  notaryIbpNo: z.string().optional(),
  notaryMcleNo: z.string().optional(),
  rejectionReason: z.string().optional(),
})

// ─── GET /api/notarization ─────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') ?? '20'), 100)
    const status = searchParams.get('status') as ENotarizationStatus | null
    const documentId = searchParams.get('documentId')
    const notaryId = searchParams.get('notaryId')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (documentId) where.documentId = documentId
    if (notaryId) where.notaryId = notaryId

    const [records, total] = await Promise.all([
      prisma.eNotarization.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          document: {
            select: {
              id: true,
              title: true,
              type: true,
              fileName: true,
              fileSize: true,
              mimeType: true,
              caseId: true,
              case: {
                select: { caseNumber: true, title: true },
              },
            },
          },
        },
      }),
      prisma.eNotarization.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: records,
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
    console.error('[GET /api/notarization]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}

// ─── POST /api/notarization ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = CreateNotarizationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Validation failed', details: parsed.error.flatten() },
        },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Verify document exists and is not already notarized
    const document = await prisma.document.findUnique({
      where: { id: data.documentId },
      include: { eNotarization: true },
    })

    if (!document) {
      return NextResponse.json(
        { success: false, error: { message: 'Document not found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    if (document.eNotarization) {
      if (document.eNotarization.status === 'NOTARIZED') {
        return NextResponse.json(
          { success: false, error: { message: 'Document is already notarized', code: 'ALREADY_NOTARIZED' } },
          { status: 422 }
        )
      }
      if (document.eNotarization.status === 'PENDING' || document.eNotarization.status === 'VERIFIED') {
        return NextResponse.json(
          { success: false, error: { message: 'Notarization request already exists for this document', code: 'DUPLICATE_REQUEST' } },
          { status: 422 }
        )
      }
    }

    const notarization = await prisma.eNotarization.create({
      data: {
        documentId: data.documentId,
        notaryId: data.notaryId,
        status: 'PENDING',
        notaryName: data.notaryName,
        notaryRollNo: data.notaryRollNo,
        notaryPtrNo: data.notaryPtrNo,
        notaryIbpNo: data.notaryIbpNo,
        notaryMcleNo: data.notaryMcleNo,
      },
      include: {
        document: {
          select: { id: true, title: true, type: true, fileName: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: notarization }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/notarization]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}

// ─── PATCH /api/notarization ───────────────────────────────────────────────────

export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = UpdateNotarizationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Validation failed', details: parsed.error.flatten() },
        },
        { status: 400 }
      )
    }

    const { id, action, ...rest } = parsed.data

    const existing = await prisma.eNotarization.findUnique({
      where: { id },
      include: { document: true },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { message: 'Notarization record not found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    // State machine validation
    const validTransitions: Record<string, ENotarizationStatus[]> = {
      verify:   ['PENDING'],
      notarize: ['VERIFIED'],
      reject:   ['PENDING', 'VERIFIED'],
    }

    if (!validTransitions[action]?.includes(existing.status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Cannot perform action "${action}" on a record with status "${existing.status}"`,
            code: 'INVALID_TRANSITION',
          },
        },
        { status: 422 }
      )
    }

    // Build update payload
    const updateData: Record<string, unknown> = {}

    if (action === 'verify') {
      updateData.status = 'VERIFIED'
      if (rest.notaryName) updateData.notaryName = rest.notaryName
      if (rest.notaryRollNo) updateData.notaryRollNo = rest.notaryRollNo
      if (rest.notaryPtrNo) updateData.notaryPtrNo = rest.notaryPtrNo
      if (rest.notaryIbpNo) updateData.notaryIbpNo = rest.notaryIbpNo
      if (rest.notaryMcleNo) updateData.notaryMcleNo = rest.notaryMcleNo

    } else if (action === 'notarize') {
      const certNumber = `EN-${new Date().getFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`
      const verificationHash = createHash('sha256')
        .update(`${existing.documentId}-${certNumber}-${Date.now()}`)
        .digest('hex')
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.quanbylegal.com'}/verify/notarization/${certNumber}`

      updateData.status = 'NOTARIZED'
      updateData.certificateNumber = certNumber
      updateData.notarizedAt = new Date()
      updateData.verificationHash = verificationHash
      updateData.verificationUrl = verificationUrl
      updateData.digitalSeal = `-----BEGIN DIGITAL SEAL-----\n${randomBytes(32).toString('base64')}\n-----END DIGITAL SEAL-----`

      if (rest.notaryName) updateData.notaryName = rest.notaryName
      if (rest.notaryRollNo) updateData.notaryRollNo = rest.notaryRollNo
      if (rest.notaryPtrNo) updateData.notaryPtrNo = rest.notaryPtrNo
      if (rest.notaryIbpNo) updateData.notaryIbpNo = rest.notaryIbpNo
      if (rest.notaryMcleNo) updateData.notaryMcleNo = rest.notaryMcleNo

      // Mark the document as notarized
      await prisma.document.update({
        where: { id: existing.documentId },
        data: {
          isNotarized: true,
          notarizedAt: new Date(),
          notaryName: rest.notaryName ?? existing.notaryName,
          notaryRollNo: rest.notaryRollNo ?? existing.notaryRollNo,
        },
      })

    } else if (action === 'reject') {
      updateData.status = 'REJECTED'
      updateData.rejectionReason = rest.rejectionReason ?? 'Notarization request rejected.'
    }

    const updated = await prisma.eNotarization.update({
      where: { id },
      data: updateData,
      include: {
        document: {
          select: { id: true, title: true, type: true, fileName: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('[PATCH /api/notarization]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}
