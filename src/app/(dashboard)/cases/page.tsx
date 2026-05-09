// Quanby Case Management Platform – Cases List Page
// Prompt 5: Full case management with search, filters, sortable table, pagination
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SkeletonTableRow } from '@/components/ui/skeleton'
import { ComplianceBadge } from '@/components/layout/ComplianceBadge'
import { CASE_TYPES, CASE_STATUSES, CASE_PRIORITIES } from '@/lib/constants'
import type { CaseType, CasePriority } from '@/types'

interface CaseSummary {
  id: string
  caseNumber: string
  title: string
  type: string
  status: string
  priority: string
  reglementaryDeadline: string | null
  nextHearingDate: string | null
  createdAt: string
  updatedAt: string
  client: {
    user: { firstName: string; lastName: string; email: string }
  }
  assignedLawyer: { id: string; firstName: string; lastName: string; barNumber: string | null } | null
  _count: { documents: number; tasks: number; timeline: number }
}

interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

const STATUS_BADGE: Record<string, string> = {
  INTAKE:            'bg-gray-100 text-gray-700',
  SCREENING:         'bg-yellow-100 text-yellow-700',
  PENDING_ASSIGNMENT:'bg-yellow-100 text-yellow-800',
  ASSIGNED:          'bg-blue-100 text-blue-700',
  ACTIVE:            'bg-green-100 text-green-700',
  ON_HOLD:           'bg-orange-100 text-orange-700',
  HEARING:           'bg-purple-100 text-purple-700',
  AWAITING_HEARING:  'bg-purple-100 text-purple-700',
  SUBMITTED:         'bg-indigo-100 text-indigo-700',
  AWAITING_DECISION: 'bg-indigo-100 text-indigo-700',
  DECIDED:           'bg-teal-100 text-teal-700',
  APPEALED:          'bg-orange-100 text-orange-800',
  CLOSED:            'bg-slate-100 text-slate-700',
  CLOSED_WON:        'bg-emerald-100 text-emerald-700',
  CLOSED_LOST:       'bg-red-100 text-red-700',
  CLOSED_SETTLED:    'bg-teal-100 text-teal-700',
  DISMISSED:         'bg-gray-100 text-gray-600',
  ARCHIVED:          'bg-gray-100 text-gray-500',
}

const PRIORITY_BADGE: Record<string, string> = {
  URGENT: 'bg-red-100 text-red-700',
  HIGH:   'bg-orange-100 text-orange-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW:    'bg-green-100 text-green-700',
}

function formatDeadline(date: string | null): { text: string; cls: string } {
  if (!date) return { text: '—', cls: 'text-gray-400' }
  const d = new Date(date)
  const days = Math.ceil((d.getTime() - Date.now()) / 86400000)
  if (days < 0) return { text: `${Math.abs(days)}d overdue`, cls: 'text-red-600 font-semibold' }
  if (days === 0) return { text: 'Today', cls: 'text-red-600 font-semibold' }
  if (days <= 3) return { text: `${days}d left`, cls: 'text-red-600 font-medium' }
  if (days <= 7) return { text: `${days}d left`, cls: 'text-orange-600 font-medium' }
  return { text: d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }), cls: 'text-gray-500' }
}

const ALL_STATUSES = Object.entries(CASE_STATUSES).map(([k, v]) => ({ value: k, label: v.label }))
const ALL_TYPES = Object.entries(CASE_TYPES).map(([k, v]) => ({ value: k, label: v.label }))
const ALL_PRIORITIES = Object.entries(CASE_PRIORITIES).map(([k, v]) => ({ value: k, label: v.label }))

export default function CasesPage() {
  const router = useRouter()
  const [cases, setCases] = useState<CaseSummary[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkStatus, setBulkStatus] = useState('')

  const fetchCases = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('pageSize', '20')
      params.set('sortBy', sortBy)
      params.set('sortOrder', sortOrder)
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      if (typeFilter) params.set('type', typeFilter)
      if (priorityFilter) params.set('priority', priorityFilter)

      const res = await fetch(`/api/cases?${params}`)
      const json = await res.json()
      if (json.success) {
        setCases(json.data)
        setPagination(json.pagination)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, typeFilter, priorityFilter, sortBy, sortOrder])

  useEffect(() => {
    const timer = setTimeout(fetchCases, 300)
    return () => clearTimeout(timer)
  }, [fetchCases])

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(col)
      setSortOrder('asc')
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const toggleSelectAll = () => {
    if (selected.size === cases.length) setSelected(new Set())
    else setSelected(new Set(cases.map((c) => c.id)))
  }

  const handleBulkStatusChange = async () => {
    if (!bulkStatus || selected.size === 0) return
    await Promise.all(
      Array.from(selected).map((id) =>
        fetch(`/api/cases/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: bulkStatus }),
        })
      )
    )
    setSelected(new Set())
    setBulkStatus('')
    fetchCases()
  }

  const SortIcon = ({ col }: { col: string }) => (
    <span className="ml-1 text-gray-400">
      {sortBy === col ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy-950">Cases</h1>
          <nav className="text-xs text-gray-400 mt-0.5">
            <Link href="/dashboard" className="hover:text-navy-700">Dashboard</Link>
            <span className="mx-1.5">/</span>
            <span className="text-navy-700 font-medium">Cases</span>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ComplianceBadge standard="SC-RULES" variant="compact" />
          <Link
            href="/intake"
            className="px-3 py-1.5 border border-navy-200 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-50 transition-colors"
          >
            📋 New Intake
          </Link>
          <Link
            href="/cases/new"
            className="px-3 py-1.5 bg-navy-950 text-white rounded-lg text-sm font-medium hover:bg-navy-800 transition-colors"
          >
            ⚖️ New Case
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="🔍 Search case #, title, docket..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="border-gray-200 text-sm h-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="h-9 rounded-lg border border-gray-200 px-3 text-sm bg-white text-gray-700"
          >
            <option value="">All Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
            className="h-9 rounded-lg border border-gray-200 px-3 text-sm bg-white text-gray-700"
          >
            <option value="">All Types</option>
            {ALL_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => { setPriorityFilter(e.target.value); setPage(1) }}
            className="h-9 rounded-lg border border-gray-200 px-3 text-sm bg-white text-gray-700"
          >
            <option value="">All Priorities</option>
            {ALL_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          {(search || statusFilter || typeFilter || priorityFilter) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 h-9"
              onClick={() => { setSearch(''); setStatusFilter(''); setTypeFilter(''); setPriorityFilter(''); setPage(1) }}
            >
              ✕ Clear
            </Button>
          )}
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-600 font-medium">{selected.size} selected</span>
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="h-8 rounded-lg border border-gray-200 px-2 text-sm bg-white text-gray-700"
            >
              <option value="">Change Status...</option>
              {ALL_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <Button size="sm" className="h-8 bg-navy-950 text-white hover:bg-navy-800" onClick={handleBulkStatusChange} disabled={!bulkStatus}>
              Apply
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-gray-500" onClick={() => setSelected(new Set())}>
              Deselect
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3 w-8" />
                  <th className="text-left px-4 py-3">Case #</th>
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3">Client</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Priority</th>
                  <th className="text-left px-4 py-3">Lawyer</th>
                  <th className="text-left px-4 py-3">Deadline</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonTableRow key={i} cols={10} />
                ))}
              </tbody>
            </table>
          </div>
        ) : cases.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="text-3xl mb-2">📁</div>
            <p className="text-sm">No cases found.</p>
            <Link href="/cases/new" className="text-blue-600 text-sm hover:underline mt-1 block">Create your first case →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={selected.size === cases.length && cases.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left px-4 py-3 cursor-pointer hover:text-navy-700" onClick={() => handleSort('caseNumber')}>
                    Case # <SortIcon col="caseNumber" />
                  </th>
                  <th className="text-left px-4 py-3 cursor-pointer hover:text-navy-700" onClick={() => handleSort('title')}>
                    Title <SortIcon col="title" />
                  </th>
                  <th className="text-left px-4 py-3">Client</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3 cursor-pointer hover:text-navy-700" onClick={() => handleSort('status')}>
                    Status <SortIcon col="status" />
                  </th>
                  <th className="text-left px-4 py-3 cursor-pointer hover:text-navy-700" onClick={() => handleSort('priority')}>
                    Priority <SortIcon col="priority" />
                  </th>
                  <th className="text-left px-4 py-3">Lawyer</th>
                  <th className="text-left px-4 py-3 cursor-pointer hover:text-navy-700" onClick={() => handleSort('reglementaryDeadline')}>
                    Deadline <SortIcon col="reglementaryDeadline" />
                  </th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cases.map((c) => {
                  const typeConfig = CASE_TYPES[c.type as CaseType]
                  const statusLabel = CASE_STATUSES[c.status as keyof typeof CASE_STATUSES]?.label ?? c.status
                  const statusClass = STATUS_BADGE[c.status] ?? 'bg-gray-100 text-gray-700'
                  const priorityConfig = CASE_PRIORITIES[c.priority as CasePriority]
                  const priorityClass = PRIORITY_BADGE[c.priority] ?? 'bg-gray-100 text-gray-700'
                  const { text: deadlineText, cls: deadlineCls } = formatDeadline(c.reglementaryDeadline)

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${selected.has(c.id) ? 'bg-blue-50' : ''}`}
                      onClick={() => router.push(`/cases/${c.id}`)}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(c.id)}
                          onChange={() => toggleSelect(c.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-navy-700 font-semibold">{c.caseNumber}</span>
                      </td>
                      <td className="px-4 py-3 max-w-[180px]">
                        <p className="font-medium text-gray-900 truncate text-sm">{c.title}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                        {c.client.user.firstName} {c.client.user.lastName}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                          {typeConfig?.label ?? c.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${priorityClass}`}>
                          {priorityConfig?.label ?? c.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                        {c.assignedLawyer
                          ? `Atty. ${c.assignedLawyer.firstName} ${c.assignedLawyer.lastName}`
                          : <span className="text-gray-400">—</span>}
                      </td>
                      <td className={`px-4 py-3 text-xs whitespace-nowrap ${deadlineCls}`}>
                        {deadlineText}
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/cases/${c.id}`}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500 text-xs">
              Showing {(pagination.page - 1) * pagination.pageSize + 1}–
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} cases
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                disabled={!pagination.hasPrev}
                onClick={() => setPage(page - 1)}
              >
                ← Prev
              </Button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(pagination.totalPages - 4, page - 2)) + i
                return (
                  <Button
                    key={p}
                    variant={page === p ? 'default' : 'outline'}
                    size="sm"
                    className={`h-7 w-7 p-0 text-xs ${page === p ? 'bg-navy-950 text-white' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                )
              })}
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                disabled={!pagination.hasNext}
                onClick={() => setPage(page + 1)}
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
