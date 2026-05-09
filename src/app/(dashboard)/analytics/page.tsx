'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  BarChart2,
  Briefcase,
  TrendingUp,
  Clock,
  FileText,
  Users,
  Download,
  Filter,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/analytics/StatCard'
import { BarChart } from '@/components/analytics/BarChart'
import { PieChart } from '@/components/analytics/PieChart'
import { LineChart } from '@/components/analytics/LineChart'
import { cn } from '@/lib/utils'

// ─── Mock data ────────────────────────────────────────────────────────────────

const DATE_RANGES = [
  { label: 'Last 7 days',  value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: '1 Year',       value: '1y' },
  { label: 'All time',     value: 'all' },
]

const CASES_BY_TYPE = [
  { label: 'Civil',            value: 42, color: 'bg-blue-500' },
  { label: 'Labor',            value: 31, color: 'bg-orange-500' },
  { label: 'Criminal',         value: 18, color: 'bg-red-500' },
  { label: 'Family',           value: 24, color: 'bg-pink-500' },
  { label: 'Commercial',       value: 19, color: 'bg-cyan-500' },
  { label: 'Administrative',   value: 12, color: 'bg-purple-500' },
  { label: 'Special Proc.',    value: 9,  color: 'bg-teal-500' },
  { label: 'Tax',              value: 7,  color: 'bg-green-500' },
]

const CASES_BY_STATUS = [
  { label: 'Active',           value: 62, color: '#22c55e' },
  { label: 'Awaiting Hearing', value: 29, color: '#3b82f6' },
  { label: 'Awaiting Decision',value: 18, color: '#8b5cf6' },
  { label: 'On Hold',          value: 11, color: '#f97316' },
  { label: 'Closed – Won',     value: 34, color: '#10b981' },
  { label: 'Closed – Lost',    value: 14, color: '#ef4444' },
  { label: 'Closed – Settled', value: 21, color: '#14b8a6' },
]

const CASES_OVER_TIME = [
  { label: 'Jul', value: 18 },
  { label: 'Aug', value: 24 },
  { label: 'Sep', value: 22 },
  { label: 'Oct', value: 31 },
  { label: 'Nov', value: 27 },
  { label: 'Dec', value: 19 },
  { label: 'Jan', value: 35 },
  { label: 'Feb', value: 42 },
  { label: 'Mar', value: 38 },
  { label: 'Apr', value: 47 },
  { label: 'May', value: 44 },
  { label: 'Jun', value: 52 },
]

const RESOLUTION_RATE_TREND = [
  { label: 'Jul', value: 68 },
  { label: 'Aug', value: 71 },
  { label: 'Sep', value: 69 },
  { label: 'Oct', value: 74 },
  { label: 'Nov', value: 76 },
  { label: 'Dec', value: 73 },
  { label: 'Jan', value: 78 },
  { label: 'Feb', value: 80 },
  { label: 'Mar', value: 82 },
  { label: 'Apr', value: 79 },
  { label: 'May', value: 84 },
  { label: 'Jun', value: 87 },
]

const CONTRACTS_BY_TYPE = [
  { label: 'Service Agreement',  value: 28, color: 'bg-blue-500' },
  { label: 'Employment',         value: 22, color: 'bg-indigo-500' },
  { label: 'NDA',                value: 19, color: 'bg-violet-500' },
  { label: 'Lease',              value: 15, color: 'bg-cyan-500' },
  { label: 'MOA/MOU',            value: 12, color: 'bg-teal-500' },
  { label: 'Deed of Sale',       value: 9,  color: 'bg-emerald-500' },
  { label: 'Other',              value: 8,  color: 'bg-slate-400' },
]

const RISK_DISTRIBUTION = [
  { label: 'Low',      value: 41, color: '#22c55e' },
  { label: 'Medium',   value: 38, color: '#eab308' },
  { label: 'High',     value: 24, color: '#f97316' },
  { label: 'Critical', value: 10, color: '#ef4444' },
]

const AVG_RISK_TREND = [
  { label: 'Jul', value: 55 },
  { label: 'Aug', value: 52 },
  { label: 'Sep', value: 58 },
  { label: 'Oct', value: 49 },
  { label: 'Nov', value: 46 },
  { label: 'Dec', value: 44 },
  { label: 'Jan', value: 41 },
  { label: 'Feb', value: 43 },
  { label: 'Mar', value: 39 },
  { label: 'Apr', value: 37 },
  { label: 'May', value: 35 },
  { label: 'Jun', value: 33 },
]

const LAWYERS = [
  { name: 'Atty. Maria Santos',    cases: 28, winRate: 82, avgDays: 94,  workload: 78 },
  { name: 'Atty. Jose Reyes',      cases: 22, winRate: 75, avgDays: 112, workload: 61 },
  { name: 'Atty. Ana Cruz',        cases: 31, winRate: 88, avgDays: 78,  workload: 91 },
  { name: 'Atty. Carlos Mendoza',  cases: 18, winRate: 71, avgDays: 130, workload: 52 },
  { name: 'Atty. Rosa Lim',        cases: 25, winRate: 80, avgDays: 89,  workload: 72 },
]

const WORKLOAD_CHART = LAWYERS.map((l) => ({
  label: l.name.replace('Atty. ', '').split(' ')[0],
  value: l.workload,
  color: l.workload >= 90 ? 'bg-red-500' : l.workload >= 70 ? 'bg-orange-500' : 'bg-blue-500',
}))

const NEW_CLIENTS_PER_MONTH = [
  { label: 'Jul', value: 8 },
  { label: 'Aug', value: 11 },
  { label: 'Sep', value: 9 },
  { label: 'Oct', value: 14 },
  { label: 'Nov', value: 12 },
  { label: 'Dec', value: 7 },
  { label: 'Jan', value: 16 },
  { label: 'Feb', value: 18 },
  { label: 'Mar', value: 15 },
  { label: 'Apr', value: 21 },
  { label: 'May', value: 19 },
  { label: 'Jun', value: 23 },
]

const TOP_CASE_TYPES_BY_CLIENT = [
  { label: 'Civil',      value: 38, color: 'bg-blue-500' },
  { label: 'Labor',      value: 29, color: 'bg-orange-500' },
  { label: 'Family',     value: 22, color: 'bg-pink-500' },
  { label: 'Criminal',   value: 14, color: 'bg-red-500' },
  { label: 'Commercial', value: 11, color: 'bg-cyan-500' },
]

// ─── Section header component ─────────────────────────────────────────────────

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
  )
}

// ─── Chart card wrapper ────────────────────────────────────────────────────────

function ChartCard({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900', className)}>
      {title && <p className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</p>}
      {children}
    </div>
  )
}

// ─── Analytics Page ───────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [range, setRange] = React.useState('1y')
  const [fadeIn, setFadeIn] = React.useState(false)

  React.useEffect(() => {
    setFadeIn(true)
  }, [])

  return (
    <div className={cn('space-y-8 transition-opacity duration-500', fadeIn ? 'opacity-100' : 'opacity-0')}>
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {/* Breadcrumb */}
          <nav className="mb-1 flex items-center gap-1 text-xs text-slate-400">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">Analytics &amp; Reports</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics &amp; Reports</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Comprehensive metrics across cases, contracts, lawyers, and clients
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date range filter */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
            {DATE_RANGES.map((dr) => (
              <button
                key={dr.value}
                onClick={() => setRange(dr.value)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                  range === dr.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                )}
              >
                {dr.label}
              </button>
            ))}
          </div>

          {/* Export buttons */}
          <Button variant="outline" size="sm" className="gap-1.5 print:hidden">
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
          <Button
            size="sm"
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white print:hidden"
            onClick={() => window.print()}
          >
            <Download className="h-3.5 w-3.5" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* ── KPI cards ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="Total Cases"
          value="189"
          icon={<Briefcase className="h-5 w-5" />}
          trend={12}
          trendLabel="vs last period"
          gradient="from-blue-600/10 to-blue-800/5"
        />
        <StatCard
          label="Resolution Rate"
          value="87%"
          icon={<CheckCircle className="h-5 w-5" />}
          trend={5}
          trendLabel="up from 82%"
          gradient="from-emerald-500/10 to-emerald-700/5"
        />
        <StatCard
          label="Avg Resolution"
          value="94 days"
          icon={<Clock className="h-5 w-5" />}
          trend={-8}
          trendLabel="8% faster"
          gradient="from-purple-500/10 to-purple-700/5"
        />
        <StatCard
          label="Active Contracts"
          value="113"
          icon={<FileText className="h-5 w-5" />}
          trend={19}
          trendLabel="vs last period"
          gradient="from-cyan-500/10 to-cyan-700/5"
        />
        <StatCard
          label="Est. Revenue"
          value="₱4.2M"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={23}
          trendLabel="vs last period"
          gradient="from-amber-500/10 to-amber-700/5"
        />
      </div>

      {/* ── Case Analytics ────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="Case Analytics"
          description="Distribution, volume trends, and outcome rates across all case types"
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Cases by Type">
            <BarChart data={CASES_BY_TYPE} orientation="horizontal" barHeight={22} />
          </ChartCard>

          <ChartCard title="Cases by Status">
            <PieChart
              data={CASES_BY_STATUS}
              size={180}
              centerLabel="Total Cases"
              centerValue={189}
              showLegend
            />
          </ChartCard>

          <ChartCard title="Monthly Case Filings (Last 12 Months)">
            <LineChart
              data={CASES_OVER_TIME}
              height={160}
              color="#2563eb"
              showArea
              showDots
              showGrid
            />
          </ChartCard>

          <ChartCard title="Resolution Rate Trend (%)">
            <LineChart
              data={RESOLUTION_RATE_TREND}
              height={160}
              color="#10b981"
              showArea
              showDots
              showGrid
            />
          </ChartCard>
        </div>
      </section>

      {/* ── Contract Analytics ────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="Contract Analytics"
          description="Contract types, risk distribution, and SC compliance metrics"
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Contracts by Type">
            <BarChart data={CONTRACTS_BY_TYPE} orientation="horizontal" barHeight={22} />
          </ChartCard>

          <ChartCard title="Risk Distribution">
            <PieChart
              data={RISK_DISTRIBUTION}
              size={180}
              centerLabel="Contracts"
              centerValue={113}
              showLegend
            />
          </ChartCard>

          <ChartCard title="Average Risk Score Trend (Lower = Better)">
            <LineChart
              data={AVG_RISK_TREND}
              height={160}
              color="#f97316"
              showArea
              showDots
              showGrid
            />
          </ChartCard>

          <ChartCard title="SC Compliance &amp; Key Metrics">
            <div className="space-y-4">
              {[
                { label: 'SC e-Rules Compliance',      value: 96, color: 'bg-emerald-500' },
                { label: 'Data Privacy Act (RA 10173)', value: 94, color: 'bg-blue-500' },
                { label: 'Electronic Commerce Act',     value: 91, color: 'bg-indigo-500' },
                { label: 'IBP Compliance',              value: 98, color: 'bg-teal-500' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.value}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className={cn('h-full rounded-full transition-all duration-700', item.color)} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </section>

      {/* ── Lawyer Performance ────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="Lawyer Performance"
          description="Case handling metrics, win rates, and workload utilization per lawyer"
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartCard>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      {['Lawyer', 'Cases', 'Win Rate', 'Avg Resolution', 'Workload'].map((h) => (
                        <th key={h} className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {LAWYERS.map((l) => (
                      <tr
                        key={l.name}
                        className="border-b border-slate-50 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                      >
                        <td className="py-3 font-medium text-slate-900 dark:text-white">{l.name}</td>
                        <td className="py-3 text-slate-600 dark:text-slate-400">{l.cases}</td>
                        <td className="py-3">
                          <span className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-semibold',
                            l.winRate >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          )}>
                            {l.winRate}%
                          </span>
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-400">{l.avgDays} days</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                              <div
                                className={cn('h-full rounded-full', l.workload >= 90 ? 'bg-red-500' : l.workload >= 70 ? 'bg-orange-500' : 'bg-blue-500')}
                                style={{ width: `${l.workload}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-600 dark:text-slate-400">{l.workload}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>

          <ChartCard title="Workload Distribution">
            <BarChart
              data={WORKLOAD_CHART}
              orientation="vertical"
              showValues
            />
          </ChartCard>
        </div>
      </section>

      {/* ── Client Analytics ──────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="Client Analytics"
          description="New client acquisition, satisfaction, and case type distribution"
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartCard title="New Clients per Month">
              <LineChart
                data={NEW_CLIENTS_PER_MONTH}
                height={160}
                color="#8b5cf6"
                showArea
                showDots
                showGrid
              />
            </ChartCard>
          </div>

          <div className="space-y-4">
            <ChartCard title="Client Satisfaction">
              <div className="flex flex-col items-center gap-2">
                <div className="relative flex h-28 w-28 items-center justify-center">
                  <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke="#8b5cf6" strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 40 * 0.92} ${2 * Math.PI * 40}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">92%</span>
                    <span className="text-[9px] text-slate-500">Satisfied</span>
                  </div>
                </div>
                <div className="w-full space-y-1.5">
                  {[
                    { label: 'Very Satisfied', pct: 58, color: 'bg-emerald-500' },
                    { label: 'Satisfied',      pct: 34, color: 'bg-blue-500' },
                    { label: 'Neutral',        pct: 6,  color: 'bg-slate-400' },
                    { label: 'Unsatisfied',    pct: 2,  color: 'bg-red-400' },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <span className="w-24 text-[10px] text-slate-500 dark:text-slate-400">{s.label}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className={cn('h-full rounded-full', s.color)} style={{ width: `${s.pct}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">{s.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Top Case Types by Client Volume">
              <BarChart
                data={TOP_CASE_TYPES_BY_CLIENT}
                orientation="horizontal"
                barHeight={18}
              />
            </ChartCard>
          </div>
        </div>
      </section>
    </div>
  )
}
