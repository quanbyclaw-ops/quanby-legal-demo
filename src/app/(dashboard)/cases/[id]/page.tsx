// Quanby Case Management Platform – Case Detail Page
// Prompt 5: Full detail with tabs: Overview, Timeline, Tasks, Documents, Contracts
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { CaseDetailClient } from './CaseDetailClient'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const c = await prisma.case.findUnique({ where: { id }, select: { caseNumber: true, title: true } })
  if (!c) return { title: 'Case Not Found' }
  return { title: `${c.caseNumber} – ${c.title} | Quanby Legal` }
}

export default async function CaseDetailPage({ params }: Props) {
  const { id } = await params
  const user = await getCurrentUser()

  const [caseData, lawyers] = await Promise.all([
    prisma.case.findUnique({
      where: { id },
      include: {
        client: { include: { user: true } },
        assignedLawyer: {
          select: {
            id: true, firstName: true, lastName: true, email: true,
            barNumber: true, specializations: true, avatarUrl: true,
            _count: { select: { assignedCases: true } },
          },
        },
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        timeline: {
          orderBy: { createdAt: 'desc' },
          include: {
            createdBy: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
          },
        },
        tasks: {
          orderBy: [{ isCompleted: 'asc' }, { dueDate: 'asc' }],
          include: {
            assignedTo: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
            createdBy: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        documents: { orderBy: { createdAt: 'desc' } },
        contracts: {
          orderBy: { createdAt: 'desc' },
          include: {
            analyses: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: { overallRiskScore: true, riskLevel: true, status: true, analysisType: true },
            },
          },
        },
        _count: { select: { documents: true, tasks: true, timeline: true, contracts: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: 'LAWYER', isActive: true },
      select: {
        id: true, firstName: true, lastName: true, barNumber: true,
        specializations: true, avatarUrl: true, maxCaseLoad: true,
        _count: { select: { assignedCases: true } },
      },
    }),
  ])

  if (!caseData) notFound()

  return (
    <CaseDetailClient
      initialCase={JSON.parse(JSON.stringify(caseData))}
      lawyers={JSON.parse(JSON.stringify(lawyers))}
      currentUser={user}
    />
  )
}
