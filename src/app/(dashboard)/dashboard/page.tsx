// Quanby Case Management Platform – Main Dashboard
// Prompt 5: Full dashboard with stats, cases, deadlines, activity feed
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ComplianceBadge } from '@/components/layout/ComplianceBadge'
import { StatCards } from '@/components/dashboard/StatCards'
import { Badge } from '@/components/ui/badge'
import { CASE_TYPES, CASE_STATUSES, CASE_PRIORITIES } from '@/lib/constants'
import type { CaseType, CaseStatus, CasePriority } from '@/types'

export const metadata: Metadata = { title: 'Dashboard – Quanby Legal' }

const STATUS_BADGE_CLASS: Record<string, string> = {
  INTAKE:           'bg-gray-100 text-gray-700',
  SCREENING:        'bg-yellow-100 text-yellow-700',
  PENDING_ASSIGNMENT:'bg-yellow-100 text-yellow-700',
  ASSIGNED:         'bg-blue-100 text-blue-700',
  ACTIVE:           'bg-green-100 text-green-700',
  ON_HOLD:          'bg-orange-100 text-orange-700',
  HEARING:          'bg-purple-100 text-purple-700',
  AWAITING_HEARING: 'bg-purple-100 text-purple-700',
  SUBMITTED:        'bg-indigo-100 text-indigo-700',
  AWAITING_DECISION:'bg-indigo-100 text-indigo-700',
  DECIDED:          'bg-teal-100 text-teal-700',
  APPEALED:         'bg-orange-100 text-orange-700',
  CLOSED:           'bg-slate-100 text-slate-700',
  CLOSED_WON:       'bg-emerald-100 text-emerald-700',
  CLOSED_LOST:      'bg-red-100 text-red-700',
  CLOSED_SETTLED:   'bg-teal-100 text-teal-700',
  DISMISSED:        'bg-gray-100 text-gray-700',
  ARCHIVED:         'bg-gray-100 text-gray-500',
}

function getDeadlineUrgencyClass(date: Date | null): string {
  if (!date) return 'text-gray-400'
  const days = Math.ceil((date.getTime() - Date.now()) / 86400000)
  if (days < 0) return 'text-red-600 font-semibold'
  if (days <= 3) return 'text-red-600 font-semibold'
  if (days <= 7) return 'text-orange-600 font-medium'
  if (days <= 14) return 'text-yellow-600'
  return 'text-gray-500'
}

function formatDeadlineCountdown(date: Date | null): string {
  if (!date) return '—'
  const days = Math.ceil((date.getTime() - Date.now()) / 86400000)
  if (days < 0) return `${Math.abs(days)}d overdue`
  if (days === 0) return 'Today'
  if (days === 1) return '1 day left'
  return `${days} days left`
}

const TIMELINE_ICONS: Record<string, string> = {
  CASE_CREATED: '🏛️',
  STATUS_CHANGED: '🔄',
  LAWYER_ASSIGNED: '👨‍⚖️',
  HEARING_SCHEDULED: '📅',
  DOCUMENT_FILED: '📄',
  DOCUMENT_RECEIVED: '📥',
  TASK_COMPLETED: '✅',
  NOTE_ADDED: '📝',
  DEADLINE_SET: '⏰',
  CLIENT_CONTACTED: '📞',
  COURT_ORDER: '⚖️',
  PAYMENT_RECEIVED: '💰',
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  // Fetch stats and data in parallel
  const now = new Date()
  const sevenDaysLater = new Date(now.getTime() + 7 * 86400000)

  const [
    totalCases,
    activeCases,
    pendingIntake,
    approachingDeadlines,
    contractsUnderReview,
    recentCases,
    upcomingDeadlines,
    recentActivity,
  ] = await Promise.all([
    prisma.case.count({ where: { status: { not: 'ARCHIVED' } } }),
    prisma.case.count({ where: { status: { in: ['ACTIVE', 'AWAITING_HEARING', 'AWAITING_DECISION', 'HEARING'] } } }),
    prisma.case.count({ where: { status: { in: ['INTAKE', 'PENDING_ASSIGNMENT'] } } }),
    prisma.case.count({
      where: {
        reglementaryDeadline: { gte: now, lte: sevenDaysLater },
        status: { not: 'ARCHIVED' },
      },
    }),
    prisma.contract.count({ where: { status: { in: ['UPLOADED', 'ANALYZING', 'ANALYZED', 'UNDER_REVIEW'] } } }),
    prisma.case.findMany({
      take: 10,
      orderBy: { updatedAt: 'desc' },
      where: { status: { not: 'ARCHIVED' } },
      include: {
        client: { include: { user: { select: { firstName: true, lastName: true } } } },
        assignedLawyer: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.case.findMany({
      take: 5,
      where: {
        status: { not: 'ARCHIVED' },
        OR: [
          { reglementaryDeadline: { gte: now, lte: sevenDaysLater } },
          { nextHearingDate: { gte: now, lte: sevenDaysLater } },
        ],
      },
      orderBy: { reglementaryDeadline: 'asc' },
      select: {
        id: true,
        caseNumber: true,
        title: true,
        reglementaryDeadline: true,
        nextHearingDate: true,
        status: true,
      },
    }),
    prisma.caseTimeline.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        case: { select: { id: true, caseNumber: true, title: true } },
        createdBy: { select: { firstName: true, lastName: true } },
      },
    }),
  ])

  const STAT_CARDS = [
    {
      label: 'Total Cases',
      value: totalCases,
      icon: '⚖️',
      change: '+3',
      changePositive: true,
      bgClass: 'bg-navy-50',
      iconBg: 'bg-navy-100',
      href: '/cases',
    },
    {
      label: 'Active Cases',
      value: activeCases,
      icon: '🟢',
      change: '+2',
      changePositive: true,
      bgClass: 'bg-green-50',
      iconBg: 'bg-green-100',
      href: '/cases',
    },
    {
      label: 'Pending Intake',
      value: pendingIntake,
      icon: '📋',
      change: pendingIntake > 5 ? '+' + pendingIntake : '—',
      changePositive: false,
      bgClass: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      href: '/intake',
    },
    {
      label: 'Approaching Deadlines',
      value: approachingDeadlines,
      icon: '⏰',
      change: approachingDeadlines > 0 ? `${approachingDeadlines} this week` : 'None',
      changePositive: approachingDeadlines === 0,
      bgClass: approachingDeadlines > 0 ? 'bg-red-50' : 'bg-green-50',
      iconBg: approachingDeadlines > 0 ? 'bg-red-100' : 'bg-green-100',
      href: '/cases',
    },
    {
      label: 'Contracts Under Review',
      value: contractsUnderReview,
      icon: '📄',
      change: '—',
      changePositive: true,
      bgClass: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      href: '/contracts',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            {user?.firstName ?? 'Counselor'} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {user?.role === 'ADMIN'
              ? 'System Administrator'
              : user?.role === 'LAWYER'
              ? `Atty. ${user.firstName} ${user.lastName} · ${user.barNumber ?? 'No Bar No.'}`
              : user?.role === 'PARALEGAL'
              ? 'Paralegal'
              : 'Client'}{' '}
            · {new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ComplianceBadge standard="SC-RULES" variant="compact" />
          <ComplianceBadge standard="RA-10173" variant="compact" />
        </div>
      </div>

      {/* Stat Cards */}
      <StatCards cards={STAT_CARDS} />

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/intake"
            className="inline-flex items-center gap-2 px-4 py-2 bg-navy-950 text-white rounded-lg text-sm font-medium hover:bg-navy-800 transition-colors"
          >
            📋 New Intake
          </Link>
          <Link
            href="/cases/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            ⚖️ New Case
          </Link>
          <Link
            href="/contracts/upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-navy-950 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            📄 Upload Contract
          </Link>
          <Link
            href="/documents"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-navy-950 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            📝 Generate Document
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Cases Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-navy-950">Recent Cases</h2>
            <Link href="/cases" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">Case #</th>
                  <th className="text-left px-4 py-3 font-medium">Title / Client</th>
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Lawyer</th>
                  <th className="text-left px-4 py-3 font-medium">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentCases.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                      No cases found.
                    </td>
                  </tr>
                )}
                {recentCases.map((c) => {
                  const typeConfig = CASE_TYPES[c.type as CaseType]
                  const statusLabel = CASE_STATUSES[c.status as keyof typeof CASE_STATUSES]?.label ?? c.status
                  const statusClass = STATUS_BADGE_CLASS[c.status] ?? 'bg-gray-100 text-gray-700'
                  const deadlineClass = getDeadlineUrgencyClass(c.reglementaryDeadline)
                  const countdown = formatDeadlineCountdown(c.reglementaryDeadline)

                  return (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/cases/${c.id}`} className="font-mono text-xs text-navy-700 hover:text-blue-600 font-medium">
                          {c.caseNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3 max-w-[200px]">
                        <Link href={`/cases/${c.id}`} className="font-medium text-gray-900 hover:text-navy-700 truncate block">
                          {c.title}
                        </Link>
                        <span className="text-xs text-gray-400">
                          {c.client.user.firstName} {c.client.user.lastName}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          {typeConfig?.label ?? c.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {c.assignedLawyer
                          ? `Atty. ${c.assignedLawyer.firstName} ${c.assignedLawyer.lastName}`
                          : <span className="text-gray-400">Unassigned</span>}
                      </td>
                      <td className={`px-4 py-3 text-xs ${deadlineClass}`}>
                        {countdown}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Deadlines + Activity */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-navy-950">Upcoming Deadlines</h2>
              <span className="text-xs text-gray-400">Next 7 days</span>
            </div>
            <div className="p-4 space-y-3">
              {upcomingDeadlines.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No deadlines in the next 7 days ✅</p>
              )}
              {upcomingDeadlines.map((c) => {
                const deadline = c.reglementaryDeadline ?? c.nextHearingDate
                const days = deadline ? Math.ceil((deadline.getTime() - Date.now()) / 86400000) : null
                const urgClass = days !== null && days <= 3
                  ? 'border-red-200 bg-red-50'
                  : days !== null && days <= 7
                  ? 'border-orange-200 bg-orange-50'
                  : 'border-yellow-200 bg-yellow-50'
                const textClass = days !== null && days <= 3
                  ? 'text-red-700'
                  : days !== null && days <= 7
                  ? 'text-orange-700'
                  : 'text-yellow-700'
                const icon = days !== null && days <= 3 ? '🚨' : days !== null && days <= 7 ? '⚠️' : '🔔'

                return (
                  <Link key={c.id} href={`/cases/${c.id}`} className={`block rounded-lg border p-3 hover:opacity-90 transition-opacity ${urgClass}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span>{icon}</span>
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold truncate ${textClass}`}>{c.caseNumber}</p>
                          <p className="text-xs text-gray-600 truncate">{c.title}</p>
                        </div>
                      </div>
                      <div className={`text-sm font-bold ${textClass} flex-shrink-0 ml-2`}>
                        {days === 0 ? 'Today' : `${days}d`}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-navy-950">Recent Activity</h2>
            </div>
            <div className="p-4 space-y-3">
              {recentActivity.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No recent activity.</p>
              )}
              {recentActivity.map((event) => (
                <div key={event.id} className="flex gap-3 text-sm">
                  <span className="text-base flex-shrink-0">{TIMELINE_ICONS[event.eventType] ?? '📌'}</span>
                  <div className="min-w-0">
                    <p className="text-gray-700 font-medium truncate text-xs">{event.title}</p>
                    {event.case && (
                      <Link href={`/cases/${event.case.id}`} className="text-xs text-blue-600 hover:text-blue-700 truncate block">
                        {event.case.caseNumber} · {event.case.title}
                      </Link>
                    )}
                    <p className="text-xs text-gray-400">
                      {event.createdBy
                        ? `${event.createdBy.firstName} ${event.createdBy.lastName} · `
                        : ''}
                      {new Date(event.createdAt).toLocaleDateString('en-PH', {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
