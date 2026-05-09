'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Shield,
  FileText,
  MessageSquare,
  Download,
  Calendar,
  HelpCircle,
  FileSearch,
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClientCaseCard } from '@/components/portal/ClientCaseCard'
import { cn } from '@/lib/utils'

// ─── Mock data ────────────────────────────────────────────────────────────────

const CLIENT = {
  name: 'Maria Elena Reyes',
  caseRef: 'QLP-2025-CLI-014',
  joinedDate: 'February 12, 2025',
}

const MY_CASES = [
  {
    caseNumber: 'QLP-2025-CIV-042',
    title: 'Recovery of Property — Lot 18, Block 4, San Jose Estate',
    type: 'Civil',
    status: 'Active',
    statusColor: 'bg-emerald-100 text-emerald-700',
    progress: 65,
    lastUpdate: '2 days ago',
    lawyerName: 'Atty. Maria Santos',
    lawyerEmail: 'msantos@quanbylegal.com',
  },
  {
    caseNumber: 'QLP-2025-LAB-018',
    title: 'Illegal Dismissal — ABC Manufacturing Corporation',
    type: 'Labor',
    status: 'Awaiting Hearing',
    statusColor: 'bg-blue-100 text-blue-700',
    progress: 45,
    lastUpdate: '5 days ago',
    lawyerName: 'Atty. Jose Reyes',
    lawyerEmail: 'jreyes@quanbylegal.com',
  },
]

const MY_DOCUMENTS = [
  {
    id: '1',
    title: 'Verified Complaint — QLP-2025-CIV-042',
    type: 'Pleading',
    size: '245 KB',
    sharedOn: 'Mar 15, 2025',
    status: 'Signed',
  },
  {
    id: '2',
    title: 'Judicial Affidavit of Maria Elena Reyes',
    type: 'Affidavit',
    size: '188 KB',
    sharedOn: 'Apr 3, 2025',
    status: 'Signed',
  },
  {
    id: '3',
    title: 'Position Paper — Illegal Dismissal',
    type: 'Pleading',
    size: '312 KB',
    sharedOn: 'May 20, 2025',
    status: 'Pending Review',
  },
  {
    id: '4',
    title: 'Legal Retainer Agreement',
    type: 'Contract',
    size: '98 KB',
    sharedOn: 'Feb 12, 2025',
    status: 'Signed',
  },
]

const MY_CONTRACTS = [
  {
    id: '1',
    title: 'Legal Retainer Agreement — Quanby Legal & Maria Elena Reyes',
    type: 'Service Agreement',
    status: 'Active',
    effectiveDate: 'Feb 12, 2025',
    expirationDate: 'Feb 12, 2026',
  },
  {
    id: '2',
    title: 'Compromise Agreement — San Jose Estate Dispute',
    type: 'Compromise Agreement',
    status: 'Under Review',
    effectiveDate: 'Apr 28, 2025',
    expirationDate: 'N/A',
  },
]

const UPDATES = [
  {
    id: '1',
    type: 'hearing',
    title: 'Hearing Scheduled',
    message: 'Next hearing for QLP-2025-LAB-018 set for June 18, 2025 at NLRC-CALABARZON.',
    time: '1 day ago',
    read: false,
    severity: 'info',
  },
  {
    id: '2',
    type: 'document',
    title: 'Document Ready for Review',
    message: 'Position Paper for illegal dismissal case is ready for your review and approval.',
    time: '3 days ago',
    read: false,
    severity: 'action',
  },
  {
    id: '3',
    type: 'deadline',
    title: 'Deadline Reminder',
    message: 'Reglementary period for submission of evidence — QLP-2025-CIV-042 ends in 7 days.',
    time: '5 days ago',
    read: true,
    severity: 'warning',
  },
  {
    id: '4',
    type: 'update',
    title: 'Case Update',
    message: 'Certificate of Non-Forum Shopping filed and received by RTC Branch 22.',
    time: '1 week ago',
    read: true,
    severity: 'success',
  },
]

const DOC_STATUS_COLORS: Record<string, string> = {
  Signed:          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Pending Review':'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Draft:           'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
}

const UPDATE_ICONS: Record<string, React.ReactNode> = {
  hearing:  <Calendar className="h-4 w-4 text-blue-600" />,
  document: <FileText className="h-4 w-4 text-indigo-600" />,
  deadline: <AlertTriangle className="h-4 w-4 text-amber-600" />,
  update:   <CheckCircle className="h-4 w-4 text-emerald-600" />,
}

const UPDATE_BG: Record<string, string> = {
  info:    'bg-blue-50 dark:bg-blue-900/10',
  action:  'bg-indigo-50 dark:bg-indigo-900/10',
  warning: 'bg-amber-50 dark:bg-amber-900/10',
  success: 'bg-emerald-50 dark:bg-emerald-900/10',
}

// ─── Portal Page ──────────────────────────────────────────────────────────────

export default function PortalPage() {
  const [fadeIn, setFadeIn] = React.useState(false)

  React.useEffect(() => {
    setFadeIn(true)
  }, [])

  return (
    <div className={cn('space-y-8 transition-opacity duration-500', fadeIn ? 'opacity-100' : 'opacity-0')}>
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div>
        <nav className="mb-1 flex items-center gap-1 text-xs text-slate-400">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">Client Portal</span>
        </nav>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome, {CLIENT.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your secure portal for case updates, documents, and legal communications.
            </p>
          </div>
          {/* SC Compliance badge */}
          <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-800 dark:bg-blue-900/20">
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">
                SC e-Rules Compliant
              </p>
              <p className="text-[9px] text-blue-500 dark:text-blue-500">
                A.M. No. 21-06-08-SC
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick stats ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Active Cases',    value: '2', icon: <Briefcase className="h-4 w-4" />, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Documents',       value: '4', icon: <FileText className="h-4 w-4" />,  color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' },
          { label: 'Contracts',       value: '2', icon: <FileSearch className="h-4 w-4" />,color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20' },
          { label: 'Unread Updates',  value: '2', icon: <Bell className="h-4 w-4" />,      color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', stat.color)}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── My Cases ─────────────────────────────────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">My Cases</h2>
          <span className="text-xs text-slate-400">{MY_CASES.length} active case{MY_CASES.length !== 1 ? 's' : ''}</span>
        </div>
        {MY_CASES.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-700">
            <Briefcase className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No active cases found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {MY_CASES.map((c) => (
              <ClientCaseCard key={c.caseNumber} {...c} />
            ))}
          </div>
        )}
      </section>

      {/* ── My Documents ─────────────────────────────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">My Documents</h2>
        </div>
        {MY_DOCUMENTS.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-700">
            <FileText className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No documents shared yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            {MY_DOCUMENTS.map((doc, idx) => (
              <div
                key={doc.id}
                className={cn(
                  'flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50',
                  idx > 0 && 'border-t border-slate-100 dark:border-slate-800'
                )}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{doc.title}</p>
                  <p className="text-xs text-slate-400">
                    {doc.type} · {doc.size} · Shared {doc.sharedOn}
                  </p>
                </div>
                <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold', DOC_STATUS_COLORS[doc.status])}>
                  {doc.status}
                </span>
                <Button variant="ghost" size="sm" className="shrink-0 h-8 w-8 p-0 text-slate-400 hover:text-blue-600">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── My Contracts ─────────────────────────────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">My Contracts</h2>
        </div>
        {MY_CONTRACTS.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-700">
            <FileSearch className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No contracts yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {MY_CONTRACTS.map((contract) => (
              <div
                key={contract.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-900/20">
                    <FileSearch className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">{contract.title}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{contract.type}</p>
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                      <span>Effective: {contract.effectiveDate}</span>
                      <span>Expires: {contract.expirationDate}</span>
                    </div>
                  </div>
                  <span className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold',
                    contract.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  )}>
                    {contract.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Updates & Notifications ───────────────────────────────────────────── */}
      <section>
        <div className="mb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Updates &amp; Notifications</h2>
        </div>
        <div className="space-y-2">
          {UPDATES.map((upd) => (
            <div
              key={upd.id}
              className={cn(
                'flex items-start gap-3 rounded-xl border border-slate-200 px-4 py-3.5 dark:border-slate-700',
                upd.read ? 'bg-white dark:bg-slate-900' : UPDATE_BG[upd.severity]
              )}
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-800">
                {UPDATE_ICONS[upd.type]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={cn('text-sm font-semibold text-slate-900 dark:text-white', !upd.read && 'font-bold')}>
                    {upd.title}
                  </p>
                  {!upd.read && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{upd.message}</p>
              </div>
              <span className="shrink-0 text-[10px] text-slate-400">{upd.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Request Actions ───────────────────────────────────────────────────── */}
      <section>
        <div className="mb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Need Something?</h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Reach out to your legal team directly.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button className="flex flex-col items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-6 py-5 text-center transition-all hover:border-blue-400 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:hover:bg-blue-900/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">Request Document</span>
            <span className="text-[10px] text-blue-500">Get a certified copy of any filed document</span>
          </button>

          <button className="flex flex-col items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-6 py-5 text-center transition-all hover:border-indigo-400 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40">
              <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">Schedule Consultation</span>
            <span className="text-[10px] text-indigo-500">Book a meeting with your lawyer</span>
          </button>

          <button className="flex flex-col items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-6 py-5 text-center transition-all hover:border-teal-400 hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-900/20 dark:hover:bg-teal-900/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/40">
              <HelpCircle className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <span className="text-sm font-semibold text-teal-800 dark:text-teal-300">Ask a Question</span>
            <span className="text-[10px] text-teal-500">Send a message to your legal team</span>
          </button>
        </div>
      </section>
    </div>
  )
}
