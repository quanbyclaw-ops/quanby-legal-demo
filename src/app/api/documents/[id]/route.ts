// Quanby Case Management Platform – Document Single Record API
// GET /api/documents/[id] – fetch document with case info
// PATCH /api/documents/[id] – update document metadata
// DELETE /api/documents/[id] – soft-delete document

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { DocumentType, DocumentStatus } from '@prisma/client'

const UpdateDocumentSchema = z.object({
  title: z.string().min(2).max(500).optional(),
  type: z.nativeEnum(DocumentType).optional(),
  status: z.nativeEnum(DocumentStatus).optional(),
  description: z.string().optional(),
  caseId: z.string().cuid().nullable().optional(),
  filedWith: z.string().optional(),
  receiptNumber: z.string().optional(),
  isNotarized: z.boolean().optional(),
  notaryName: z.string().optional(),
  notaryRollNo: z.string().optional(),
  docStampSerial: z.string().optional(),
})

type RouteContext = { params: Promise<{ id: string }> }

// ─── GET /api/documents/[id] ───────────────────────────────────────────────────

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } },
        { status: 401 }
      )
    }

    const { id } = await context.params

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        case: {
          select: {
            id: true,
            caseNumber: true,
            title: true,
            type: true,
            status: true,
            courtName: true,
            courtLevel: true,
            client: {
              select: {
                user: {
                  select: { firstName: true, lastName: true, email: true },
                },
              },
            },
          },
        },
        uploadedBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        eNotarization: {
          select: {
            id: true,
            status: true,
            certificateNumber: true,
            notarizedAt: true,
            notaryName: true,
            notaryRollNo: true,
            notaryPtrNo: true,
            notaryIbpNo: true,
            notaryMcleNo: true,
            verificationUrl: true,
            verificationHash: true,
          },
        },
      },
    })

    if (!document) {
      return NextResponse.json(
        { success: false, error: { message: 'Document not found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: document })
  } catch (error) {
    console.error(`[GET /api/documents/[id]]`, error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}

// ─── PATCH /api/documents/[id] ────────────────────────────────────────────────

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } },
        { status: 401 }
      )
    }

    const { id } = await context.params

    const existing = await prisma.document.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: { message: 'Document not found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    const body = await request.json()
    const parsed = UpdateDocumentSchema.safeParse(body)

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

    // Validate caseId if changing
    if (data.caseId !== undefined && data.caseId !== null) {
      const caseExists = await prisma.case.findUnique({ where: { id: data.caseId } })
      if (!caseExists) {
        return NextResponse.json(
          { success: false, error: { message: 'Case not found' } },
          { status: 404 }
        )
      }
    }

    const updated = await prisma.document.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.caseId !== undefined && { caseId: data.caseId }),
        ...(data.filedWith !== undefined && { filedWith: data.filedWith }),
        ...(data.receiptNumber !== undefined && { receiptNumber: data.receiptNumber }),
        ...(data.isNotarized !== undefined && { isNotarized: data.isNotarized }),
        ...(data.notaryName !== undefined && { notaryName: data.notaryName }),
        ...(data.notaryRollNo !== undefined && { notaryRollNo: data.notaryRollNo }),
        ...(data.docStampSerial !== undefined && { docStampSerial: data.docStampSerial }),
        ...(data.isNotarized === true && { notarizedAt: new Date() }),
      },
      include: {
        case: { select: { id: true, caseNumber: true, title: true } },
        uploadedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    })

    // Log timeline event if case linked and status changed
    if (existing.caseId && data.status && data.status !== existing.status) {
      const dbUser = await prisma.user.findFirst({ where: { email: currentUser.email } })
      if (dbUser) {
        await prisma.caseTimeline.create({
          data: {
            caseId: existing.caseId,
            eventType: 'DOCUMENT_FILED',
            title: `Document status updated: ${existing.title}`,
            description: `Document "${existing.title}" status changed from ${existing.status} to ${data.status}`,
            createdById: dbUser.id,
          },
        }).catch(() => {/* Non-critical */})
      }
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error(`[PATCH /api/documents/[id]]`, error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}

// ─── DELETE /api/documents/[id] ───────────────────────────────────────────────

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } },
        { status: 401 }
      )
    }

    const { id } = await context.params

    const existing = await prisma.document.findUnique({
      where: { id },
      include: { eNotarization: true },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { message: 'Document not found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    // Prevent deletion of notarized documents
    if (existing.isNotarized || existing.eNotarization?.status === 'NOTARIZED') {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Notarized documents cannot be deleted. Archive instead.',
            code: 'NOTARIZED_DOCUMENT',
          },
        },
        { status: 422 }
      )
    }

    // Archive instead of hard delete for audit trail
    await prisma.document.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    })

    // Log timeline if linked to case
    if (existing.caseId) {
      const dbUser = await prisma.user.findFirst({ where: { email: currentUser.email } })
      if (dbUser) {
        await prisma.caseTimeline.create({
          data: {
            caseId: existing.caseId,
            eventType: 'NOTE_ADDED',
            title: `Document archived: ${existing.title}`,
            description: `Document "${existing.title}" was archived by ${dbUser.firstName} ${dbUser.lastName}`,
            createdById: dbUser.id,
          },
        }).catch(() => {/* Non-critical */})
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Document archived successfully. Records retained per RA 10173 data retention policy.',
    })
  } catch (error) {
    console.error(`[DELETE /api/documents/[id]]`, error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}
