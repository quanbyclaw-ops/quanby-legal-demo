// Quanby Case Management Platform – Documents API Route
// GET /api/documents – list documents with filters
// POST /api/documents – upload/create document record

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { DocumentType, DocumentStatus } from '@prisma/client'

const CreateDocumentSchema = z.object({
  title: z.string().min(2).max(500),
  type: z.nativeEnum(DocumentType),
  status: z.nativeEnum(DocumentStatus).default('DRAFT'),
  caseId: z.string().cuid().optional(),
  contractId: z.string().cuid().optional(),
  description: z.string().optional(),
  fileName: z.string().min(1),
  fileSize: z.number().positive(),
  mimeType: z.string().min(1),
  fileUrl: z.string().url().optional(),
  isConfidential: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  version: z.number().default(1),
})

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
    const sortBy = searchParams.get('sortBy') ?? 'updatedAt'
    const sortOrder = (searchParams.get('sortOrder') ?? 'desc') as 'asc' | 'desc'
    const caseId = searchParams.get('caseId')
    const contractId = searchParams.get('contractId')
    const type = searchParams.get('type') as DocumentType | null
    const status = searchParams.get('status') as DocumentStatus | null
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (caseId) where.caseId = caseId
    if (contractId) where.contractId = contractId
    if (type) where.type = type
    if (status) where.status = status
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { fileName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
        include: {
          case: {
            select: { id: true, caseNumber: true, title: true },
          },
          uploadedBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
      prisma.document.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: documents,
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
    console.error('[GET /api/documents]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } },
        { status: 401 }
      )
    }

    // For demo: parse JSON body (in production this would handle multipart/form-data)
    const body = await request.json()
    const parsed = CreateDocumentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Validation failed',
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Validate case or contract exists if provided
    if (data.caseId) {
      const caseExists = await prisma.case.findUnique({ where: { id: data.caseId } })
      if (!caseExists) {
        return NextResponse.json(
          { success: false, error: { message: 'Case not found' } },
          { status: 404 }
        )
      }
    }

    if (data.contractId) {
      const contractExists = await prisma.contract.findUnique({ where: { id: data.contractId } })
      if (!contractExists) {
        return NextResponse.json(
          { success: false, error: { message: 'Contract not found' } },
          { status: 404 }
        )
      }
    }

    // Find the db user record
    const dbUser = await prisma.user.findFirst({
      where: { email: currentUser.email },
    })

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: { message: 'User record not found' } },
        { status: 404 }
      )
    }

    const document = await prisma.document.create({
      data: {
        title: data.title,
        type: data.type,
        status: data.status,
        caseId: data.caseId,
        description: data.description,
        fileName: data.fileName,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        storageUrl: data.fileUrl,
        uploadedById: dbUser.id,
      },
      include: {
        case: {
          select: { id: true, caseNumber: true, title: true },
        },
        uploadedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    })

    // Log timeline event if linked to a case
    if (data.caseId) {
      await prisma.caseTimeline.create({
        data: {
          caseId: data.caseId,
          eventType: 'DOCUMENT_FILED',
          title: `Document uploaded: ${data.title}`,
          description: `${data.type} document "${data.title}" (${data.fileName}) uploaded by ${dbUser.firstName} ${dbUser.lastName}`,
          createdById: dbUser.id,
        },
      }).catch(() => {
        // Non-critical: timeline entry failure should not block document creation
      })
    }

    return NextResponse.json({ success: true, data: document }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/documents]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}
