'use client'

// Quanby Case Management Platform – Contract Agent Main Page
// Hero section, stats, contract list, filter bar, recent analyses

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { SkeletonContractCard, SkeletonStatCard } from '@/components/ui/skeleton'
import { ComplianceBadge } from '@/components/layout/ComplianceBadge'
import { RiskGauge } from '@/components/contracts/RiskGauge'
import { TemplateGenerator } from '@/components/contracts/TemplateGenerator'

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_CONTRACTS = [
  {
    id: 'clx001',
    title: 'Service Agreement – Quanby Technologies Inc.',
    type: 'SERVICE',
    status: 'ANALYZED',
    partyA: 'Quanby Technologies Inc.',
    partyB: 'Department of Information and Communications Technology',
    value: 5000000,
    riskScore: 28,
    riskLevel: 'LOW',
    uploadDate: '2026-05-02',
    scCompliant: true,
  },
  {
    id: 'clx002',
    title: 'Non-Disclosure Agreement – FinSecure Corp.',
    type: 'NDA',
    status: 'ANALYZED',
    partyA: 'Juan dela Cruz',
    partyB: 'FinSecure Corporation',
    value: null,
    riskScore: 42,
    riskLevel: 'MEDIUM',
    uploadDate: '2026-05-05',
    scCompliant: null,
  },
  {
    id: 'clx003',
    title: 'Employment Contract – Senior Developer',
    type: 'EMPLOYMENT',
    status: 'PENDING_REVIEW',
    partyA: 'Quanby Technologies Inc.',
    partyB: 'Maria Santos',
    value: 840000,
    riskScore: 67,
    riskLevel: 'HIGH',
    uploadDate: '2026-05-06',
    scCompliant: false,
  },
  {
    id: 'clx004',
    title: 'Memorandum of Agreement – LGU Partnership',
    type: 'MOA',
    status: 'ANALYZED',
    partyA: 'Municipality of Santa Cruz, Laguna',
    partyB: 'Quanby Technologies Inc.',
    value: 2500000,
    riskScore: 15,
    riskLevel: 'LOW',
    uploadDate: '2026-05-07',
    scCompliant: true,
  },
  {
    id: 'clx005',
    title: 'Lease Agreement – BGC Office Space',
    type: 'LEASE',
    status: 'UPLOADED',
    partyA: 'Bonifacio Global City Properties',
    partyB: 'Quanby Technologies Inc.',
    value: 1200000,
    riskScore: 88,
    riskLevel: 'CRITICAL',
    uploadDate: '2026-05-08',
    scCompliant: false,
  },
]

const STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'secondary' | 'destructive' }> = {
  ANALYZED:       { label: 'Analyzed',       variant: 'success' },
  PENDING_REVIEW: { label: 'Pending Review', variant: 'warning' },
  UPLOADED:       { label: 'Uploaded',       variant: 'info' },
  ANALYZING:      { label: 'Analyzing...',   variant: 'info' },
  DRAFT:          { label: 'Draft',          variant: 'secondary' },
}

const TYPE_COLORS: Record<string, string> = {
  SERVICE:    'bg-blue-100 text-blue-700',
  NDA:        'bg-purple-100 text-purple-700',
  EMPLOYMENT: 'bg-orange-100 text-orange-700',
  MOA:        'bg-teal-100 text-teal-700',
  LEASE:      'bg-yellow-100 text-yellow-700',
  SALE:       'bg-pink-100 text-pink-700',
}

function formatPHP(value: number) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(value)
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

function RiskBar({ score }: { score: number }) {
  const color = score < 30 ? 'bg-green-500' : score < 60 ? 'bg-yellow-500' : score < 80 ? 'bg-orange-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 rounded-full bg-gray-200 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-600">{score}</span>
    </div>
  )
}

export default function ContractsPage() {
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterRisk, setFilterRisk] = useState('')
  const [search, setSearch] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const [loading, setLoading] = useState(true)

  // Simulate loading (mock data delay)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  const filtered = MOCK_CONTRACTS.filter(c => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) &&
        !c.partyA.toLowerCase().includes(search.toLowerCase()) &&
        !c.partyB.toLowerCase().includes(search.toLowerCase())) return false
    if (filterType && c.type !== filterType) return false
    if (filterStatus && c.status !== filterStatus) return false
    if (filterRisk) {
      if (filterRisk === 'LOW' && c.riskScore >= 30) return false
      if (filterRisk === 'MEDIUM' && (c.riskScore < 30 || c.riskScore >= 60)) return false
      if (filterRisk === 'HIGH' && (c.riskScore < 60 || c.riskScore >= 80)) return false
      if (filterRisk === 'CRITICAL' && c.riskScore < 80) return false
    }
    return true
  })

  const stats = {
    total: MOCK_CONTRACTS.length,
    analyzed: MOCK_CONTRACTS.filter(c => c.status === 'ANALYZED').length,
    pending: MOCK_CONTRACTS.filter(c => c.status === 'PENDING_REVIEW' || c.status === 'UPLOADED').length,
    highRisk: MOCK_CONTRACTS.filter(c => c.riskScore >= 60).length,
  }

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-950 via-slate-900 to-blue-950 px-6 py-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-400 blur-3xl" />
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm text-2xl">
                🤖
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Contract Agent</h1>
                <p className="text-sm text-blue-200">AI-Powered Contract Analysis & Management</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <ComplianceBadge standard="SC-RULES" variant="compact" className="border-white/20 bg-white/10 text-white" />
              <ComplianceBadge standard="RA-10173" variant="compact" className="border-white/20 bg-white/10 text-white" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contracts/upload"
              className="flex items-center gap-2 rounded-xl bg-white text-navy-950 px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 transition-colors shadow"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Contract
            </Link>
            <button
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm text-white px-4 py-2.5 text-sm font-semibold hover:bg-white/20 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate from Template
            </button>
          </div>
        </div>
      </div>

      {/* Template Generator (collapsible) */}
      {showTemplates && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <TemplateGenerator />
        </div>
      )}

      {/* Stats Row */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Contracts', value: stats.total, icon: '📄', color: 'text-navy-950', bg: 'bg-slate-50' },
            { label: 'Analyzed', value: stats.analyzed, icon: '✅', color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Pending Review', value: stats.pending, icon: '⏳', color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'High Risk Flagged', value: stats.highRisk, icon: '🚨', color: 'text-red-600', bg: 'bg-red-50' },
          ].map(stat => (
            <div key={stat.label} className={`rounded-xl border border-gray-200 ${stat.bg} p-4`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{stat.icon}</span>
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters + Search */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-48">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contracts, parties..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Types</option>
          {['SERVICE', 'NDA', 'EMPLOYMENT', 'MOA', 'LEASE', 'SALE'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Statuses</option>
          {['ANALYZED', 'PENDING_REVIEW', 'UPLOADED', 'ANALYZING'].map(s => <option key={s} value={s}>{STATUS_CONFIG[s]?.label ?? s}</option>)}
        </select>
        <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Risk Levels</option>
          <option value="LOW">Low Risk</option>
          <option value="MEDIUM">Medium Risk</option>
          <option value="HIGH">High Risk</option>
          <option value="CRITICAL">Critical</option>
        </select>
        {(filterType || filterStatus || filterRisk || search) && (
          <button type="button" onClick={() => { setFilterType(''); setFilterStatus(''); setFilterRisk(''); setSearch('') }} className="text-xs text-gray-500 hover:text-gray-700">
            Clear filters
          </button>
        )}
      </div>

      {/* Contract List */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-navy-950">All Contracts</h2>
          <span className="text-xs text-gray-400">{filtered.length} of {MOCK_CONTRACTS.length} shown</span>
        </div>
        <div className="divide-y divide-gray-100">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonContractCard key={i} />)
          ) : filtered.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm text-gray-500">No contracts match the current filters.</p>
            </div>
          ) : filtered.map(contract => (
            <Link key={contract.id} href={`/contracts/${contract.id}`} className="block px-6 py-4 hover:bg-gray-50 transition-colors group">
              <div className="flex items-start gap-4">
                {/* Risk gauge (mini) */}
                <div className="flex-shrink-0 hidden sm:block">
                  <RiskGauge score={contract.riskScore} size="sm" showLabel={false} />
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-navy-950 text-sm group-hover:text-blue-700 transition-colors truncate">
                        {contract.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${TYPE_COLORS[contract.type] ?? 'bg-gray-100 text-gray-600'}`}>
                          {contract.type}
                        </span>
                        <Badge variant={STATUS_CONFIG[contract.status]?.variant ?? 'secondary'} size="sm">
                          {STATUS_CONFIG[contract.status]?.label ?? contract.status}
                        </Badge>
                        {contract.scCompliant === true && (
                          <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full font-medium">SC ✓</span>
                        )}
                        {contract.scCompliant === false && (
                          <span className="text-xs text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full font-medium">SC ✗</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {contract.value && (
                        <p className="text-sm font-bold text-navy-950">{formatPHP(contract.value)}</p>
                      )}
                      <p className="text-xs text-gray-400">{formatDate(contract.uploadDate)}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      <span className="font-medium">Parties:</span> {contract.partyA} ↔ {contract.partyB}
                    </p>
                    <RiskBar score={contract.riskScore} />
                  </div>
                </div>

                {/* Arrow */}
                <svg className="h-4 w-4 text-gray-300 group-hover:text-blue-500 flex-shrink-0 mt-1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Analyses Panel */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-navy-950 mb-4">Recent AI Analyses</h2>
        <div className="space-y-3">
          {MOCK_CONTRACTS.filter(c => c.status === 'ANALYZED').map(c => (
            <Link key={c.id} href={`/contracts/${c.id}`} className="flex items-center gap-4 rounded-xl p-3 hover:bg-gray-50 transition-colors group">
              <RiskGauge score={c.riskScore} size="sm" showLabel={false} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-navy-950 truncate group-hover:text-blue-700">{c.title}</p>
                <p className="text-xs text-gray-500">Analyzed {formatDate(c.uploadDate)}</p>
              </div>
              <Badge variant={c.riskScore < 30 ? 'success' : c.riskScore < 60 ? 'warning' : 'destructive'} size="sm">
                {c.riskScore < 30 ? 'Low' : c.riskScore < 60 ? 'Medium' : c.riskScore < 80 ? 'High' : 'Critical'}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
