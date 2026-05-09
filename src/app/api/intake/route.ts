// Quanby Case Management Platform – Client Intake API
// POST /api/intake — Creates Client + Case (INTAKE status) + initial CaseTimeline entry

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const IntakeSchema = z.object({
  // Personal
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  suffix: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  civilStatus: z.string().optional(),
  nationality: z.string().default('Filipino'),

  // Contact
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Phone number is required'),
  alternatePhone: z.string().optional(),

  // Address
  streetAddress: z.string().optional(),
  barangay: z.string().optional(),
  municipality: z.string().optional(),
  province: z.string().optional(),
  region: z.string().optional(),
  zipCode: z.string().optional(),

  // Financial
  monthlyIncome: z.number().nonnegative().optional(),
  occupation: z.string().optional(),
  employer: z.string().optional(),

  // Case details
  caseType: z.string().min(1, 'Case type is required'),
  caseDescription: z.string().min(10, 'Case description is required'),
  opposingParty: z.string().optional(),
  courtPreference: z.string().optional(),
  desiredOutcome: z.string().optional(),

  // Eligibility
  eligibilityAnswers: z.record(z.string(), z.string()).optional(),
  eligibilityResult: z.enum(['ELIGIBLE', 'NEEDS_REVIEW', 'NOT_ELIGIBLE']).optional(),
})

// Generate sequential case number like QLF-2025-00001
async function generateCaseNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const count = await prisma.case.count({
    where: { caseNumber: { startsWith: `QLF-${year}-` } },
  })
  const seq = String(count + 1).padStart(5, '0')
  return `QLF-${year}-${seq}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = IntakeSchema.parse(body)

    // Use a system/placeholder userId for demo (no auth middleware)
    // In production, extract from Clerk session
    let systemUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
    if (!systemUser) {
      systemUser = await prisma.user.create({
        data: {
          clerkId: 'system-intake',
          email: 'system@quanbylegal.ph',
          firstName: 'System',
          lastName: 'Intake',
          role: 'ADMIN',
        },
      })
    }

    // Check if client email already exists
    let existingUser = await prisma.user.findUnique({ where: { email: data.email } })
    let clientUser = existingUser

    if (!clientUser) {
      clientUser = await prisma.user.create({
        data: {
          clerkId: `intake-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: 'CLIENT',
        },
      })
    }

    // Create or find Client profile
    let client = await prisma.client.findUnique({ where: { userId: clientUser.id } })
    if (!client) {
      const eligStatus =
        data.eligibilityResult === 'ELIGIBLE'
          ? 'ELIGIBLE'
          : data.eligibilityResult === 'NOT_ELIGIBLE'
          ? 'INELIGIBLE'
          : data.eligibilityResult === 'NEEDS_REVIEW'
          ? 'REQUIRES_REVIEW'
          : 'PENDING'

      const monthlyIncome =
        data.monthlyIncome !== undefined ? data.monthlyIncome : undefined

      client = await prisma.client.create({
        data: {
          userId: clientUser.id,
          middleName: data.middleName,
          suffix: data.suffix,
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
          alternatePhone: data.alternatePhone,
          monthlyIncome: monthlyIncome,
          occupation: data.occupation,
          employer: data.employer,
          eligibilityStatus: eligStatus as never,
          isPaoEligible:
            monthlyIncome !== undefined && monthlyIncome <= 18000,
        },
      })
    }

    const caseNumber = await generateCaseNumber()

    // Create Case
    const newCase = await prisma.case.create({
      data: {
        caseNumber,
        title: `${data.caseType} – ${data.firstName} ${data.lastName}`,
        type: data.caseType as never,
        status: 'INTAKE',
        priority: 'MEDIUM',
        description: data.caseDescription,
        opposingParty: data.opposingParty,
        reliefSought: data.desiredOutcome,
        courtName: data.courtPreference,
        clientId: client.id,
        createdById: systemUser.id,
      },
    })

    // Create initial CaseTimeline entry
    await prisma.caseTimeline.create({
      data: {
        caseId: newCase.id,
        eventType: 'CASE_CREATED',
        title: 'Client Intake Submitted',
        description: `Intake form submitted by ${data.firstName} ${data.lastName}. Eligibility: ${data.eligibilityResult ?? 'PENDING'}.`,
        createdById: systemUser.id,
        metadata: {
          eligibilityResult: data.eligibilityResult,
          eligibilityAnswers: data.eligibilityAnswers,
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          caseId: newCase.id,
          caseNumber: newCase.caseNumber,
          clientId: client.id,
        },
        message: `Client intake recorded. Case ${caseNumber} created.`,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { message: 'Validation failed', details: error.errors } },
        { status: 400 }
      )
    }
    console.error('[intake/route] POST error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}
