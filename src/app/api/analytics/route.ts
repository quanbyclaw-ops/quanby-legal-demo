// Quanby Case Management Platform – Analytics API Route
// GET /api/analytics – returns dashboard and analytics data
// Serves both live Prisma aggregates and supplementary mock data for demo

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// ─── Mock time-series helpers ──────────────────────────────────────────────────

function generateMonthlyTrend(baseValue: number, months = 12, variance = 0.3) {
  const result = []
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleString('en-PH', { month: 'short', year: '2-digit' })
    const fluctuation = 1 + (Math.random() - 0.5) * variance
    result.push({
      date: d.toISOString().slice(0, 7),
      value: Math.round(baseValue * fluctuation),
      label,
    })
  }
  return result
}

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
    const section = searchParams.get('section') ?? 'all'

    // ── Live aggregates from Prisma ────────────────────────────────────────────
    const [
      totalCases,
      activeCases,
      closedCases,
      pendingCases,
      totalClients,
      totalContracts,
      totalDocuments,
      casesByType,
      casesByStatus,
      casesByPriority,
      recentCases,
      contractsByStatus,
      upcomingDeadlines,
    ] = await Promise.all([
      prisma.case.count(),
      prisma.case.count({ where: { status: 'ACTIVE' } }),
      prisma.case.count({ where: { status: 'CLOSED' } }),
      prisma.case.count({ where: { status: 'PENDING_ASSIGNMENT' } }),
      prisma.client.count(),
      prisma.contract.count(),
      prisma.document.count(),
      prisma.case.groupBy({ by: ['type'], _count: { id: true } }),
      prisma.case.groupBy({ by: ['status'], _count: { id: true } }),
      prisma.case.groupBy({ by: ['priority'], _count: { id: true } }),
      prisma.case.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          caseNumber: true,
          title: true,
          status: true,
          priority: true,
          type: true,
          createdAt: true,
        },
      }),
      prisma.contract.groupBy({ by: ['status'], _count: { id: true } }),
      prisma.case.findMany({
        where: {
          reglementaryDeadline: {
            gte: new Date(),
            lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { reglementaryDeadline: 'asc' },
        take: 10,
        select: {
          id: true,
          caseNumber: true,
          title: true,
          reglementaryDeadline: true,
          priority: true,
        },
      }),
    ])

    // ── Derived / computed values ──────────────────────────────────────────────
    const caseTypeMap = Object.fromEntries(
      casesByType.map((r) => [r.type, r._count.id])
    )
    const caseStatusMap = Object.fromEntries(
      casesByStatus.map((r) => [r.status, r._count.id])
    )
    const casePriorityMap = Object.fromEntries(
      casesByPriority.map((r) => [r.priority, r._count.id])
    )
    const contractStatusMap = Object.fromEntries(
      contractsByStatus.map((r) => [r.status, r._count.id])
    )

    // ── Mock supplementary data ────────────────────────────────────────────────
    const caseVolumeTrend = generateMonthlyTrend(Math.max(totalCases / 12, 3))
    const revenueByMonth = generateMonthlyTrend(125000, 12, 0.4)

    const caseTypeDistribution = casesByType.map((r) => ({
      name: r.type.replace(/_/g, ' '),
      value: r._count.id,
    }))

    const lawyerWorkload = [
      { lawyerId: '1', lawyerName: 'Atty. Maria Santos', activeCases: activeCases > 4 ? Math.ceil(activeCases * 0.35) : 2, maxCaseLoad: 20, utilizationRate: 0 },
      { lawyerId: '2', lawyerName: 'Atty. Juan dela Cruz', activeCases: activeCases > 4 ? Math.ceil(activeCases * 0.30) : 2, maxCaseLoad: 20, utilizationRate: 0 },
      { lawyerId: '3', lawyerName: 'Atty. Lucía Reyes', activeCases: activeCases > 4 ? Math.ceil(activeCases * 0.20) : 1, maxCaseLoad: 15, utilizationRate: 0 },
      { lawyerId: '4', lawyerName: 'Atty. Carlos Mendoza', activeCases: activeCases > 4 ? Math.ceil(activeCases * 0.15) : 1, maxCaseLoad: 15, utilizationRate: 0 },
    ].map((l) => ({
      ...l,
      utilizationRate: parseFloat(((l.activeCases / l.maxCaseLoad) * 100).toFixed(1)),
    }))

    // Case outcome simulation (of closed cases)
    const closedTotal = closedCases || 1
    const caseOutcomeRate = {
      won: Math.round(closedTotal * 0.42),
      settled: Math.round(closedTotal * 0.28),
      dismissed: Math.round(closedTotal * 0.15),
      lost: Math.round(closedTotal * 0.10),
      active: activeCases,
    }

    const deadlineComplianceRate = totalCases > 0
      ? parseFloat((((totalCases - (caseStatusMap['OVERDUE'] ?? 0)) / totalCases) * 100).toFixed(1))
      : 100

    const averageCaseDurationDays = 87 // mock

    // ── Assemble response ──────────────────────────────────────────────────────
    const analyticsPayload = {
      summary: {
        totalCases,
        activeCases,
        closedCases,
        pendingCases,
        totalClients,
        totalContracts,
        totalDocuments,
        pendingAssignment: caseStatusMap['PENDING'] ?? 0,
        upcomingDeadlinesCount: upcomingDeadlines.length,
      },
      caseStats: {
        byType: caseTypeMap,
        byStatus: caseStatusMap,
        byPriority: casePriorityMap,
        typeDistribution: caseTypeDistribution,
        outcomeRate: caseOutcomeRate,
      },
      contractStats: {
        byStatus: contractStatusMap,
        total: totalContracts,
        activeCount: contractStatusMap['ACTIVE'] ?? 0,
        expiredCount: contractStatusMap['EXPIRED'] ?? 0,
        pendingReview: contractStatusMap['UNDER_REVIEW'] ?? 0,
      },
      trends: {
        caseVolume: caseVolumeTrend,
        revenueByMonth,
      },
      lawyerWorkload,
      performance: {
        averageCaseDurationDays,
        deadlineComplianceRate,
        clientSatisfactionScore: 4.7,
        caseResolutionRate: totalCases > 0
          ? parseFloat(((closedCases / totalCases) * 100).toFixed(1))
          : 0,
      },
      recentActivity: {
        recentCases,
        upcomingDeadlines,
      },
    }

    // Optionally return a specific section only
    if (section !== 'all' && section in analyticsPayload) {
      return NextResponse.json({
        success: true,
        data: analyticsPayload[section as keyof typeof analyticsPayload],
      })
    }

    return NextResponse.json({ success: true, data: analyticsPayload })
  } catch (error) {
    console.error('[GET /api/analytics]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}
