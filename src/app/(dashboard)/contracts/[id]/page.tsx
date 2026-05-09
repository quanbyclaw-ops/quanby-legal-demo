'use client'

// Quanby Legal Platform – Contract Detail & AI Analysis Page
// Full tabbed layout: Analysis | Chat | Details | Documents | History

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ComplianceBadge } from '@/components/layout/ComplianceBadge'
import { RiskGauge } from '@/components/contracts/RiskGauge'
import { AnalysisResults } from '@/components/contracts/AnalysisResults'
import { ContractChat } from '@/components/contracts/ContractChat'
import { TemplateGenerator } from '@/components/contracts/TemplateGenerator'
import { use } from 'react'

// ─── Mock Contract Data ────────────────────────────────────────────────────────

const MOCK_CONTRACT: {id:string;title:string;type:string;status:string;partyA:string;partyB:string;value:number;effectiveDate:string;expirationDate:string;uploadDate:string;linkedCase:{id:string;caseNumber:string;title:string};fileName:string;fileSize:number;analysis:import('@/components/contracts/AnalysisResults').AnalysisData;history:{date:string;action:string;user:string}[]} = {
  id: 'clx001',
  title: 'Service Agreement – Quanby Technologies Inc.',
  type: 'SERVICE',
  status: 'ANALYZED',
  partyA: 'Quanby Technologies Inc.',
  partyB: 'Department of Information and Communications Technology',
  value: 5000000,
  effectiveDate: '2026-06-01',
  expirationDate: '2027-05-31',
  uploadDate: '2026-05-02',
  linkedCase: { id: 'case003', caseNumber: 'QLP-2026-003', title: 'LGU Procurement Dispute' },
  fileName: 'service-agreement-dict-2026.pdf',
  fileSize: 1245678,
  analysis: {
    overallRiskScore: 28,
    riskLevel: 'LOW' as const,
    scCompliant: true,
    summary: 'This Service Agreement between Quanby Technologies Inc. and the Department of Information and Communications Technology is generally well-structured and compliant with Philippine commercial law. The contract covers software development services with clear deliverables, payment terms, and IP ownership provisions. Minor gaps identified in data privacy provisions and dispute resolution specificity. Overall risk is LOW with 2 medium-severity recommendations.',
    keyClauses: [
      {
        title: 'Scope of Services',
        text: 'Service Provider shall deliver custom software development services including system analysis, design, development, testing, and deployment as specified in the attached Technical Requirements Document (TRD).',
        riskLevel: 'LOW' as const,
        section: 'Section 2',
        explanation: 'Scope is adequately defined with reference to TRD. Recommend ensuring TRD is formally incorporated as an exhibit to the contract.'
      },
      {
        title: 'Payment Terms',
        text: 'Client shall pay Service Provider a total contract value of PHP 5,000,000 in quarterly installments upon milestone acceptance, within thirty (30) days of receipt of invoice.',
        riskLevel: 'LOW',
        section: 'Section 4',
        explanation: 'Standard milestone-based payment structure. Payment terms comply with government procurement guidelines under RA 9184.'
      },
      {
        title: 'Intellectual Property',
        text: 'All work product, source code, documentation, and deliverables created under this Agreement shall be the exclusive property of Client upon final payment.',
        riskLevel: 'MEDIUM',
        section: 'Section 8',
        explanation: 'IP ownership clause triggers RA 8293 (Intellectual Property Code) obligations. Service Provider should ensure pre-existing IP and third-party libraries are properly carved out.'
      },
      {
        title: 'Termination for Convenience',
        text: 'Either party may terminate this Agreement upon thirty (30) days written notice without cause.',
        riskLevel: 'MEDIUM',
        section: 'Section 12',
        explanation: 'Termination for convenience without cause exposes Service Provider to potential abrupt revenue loss. Consider negotiating a minimum performance period and termination fee.'
      },
      {
        title: 'Confidentiality',
        text: 'Each party agrees to maintain the confidentiality of the other party\'s Confidential Information for the duration of this Agreement and for two (2) years thereafter.',
        riskLevel: 'LOW',
        section: 'Section 9',
        explanation: 'Confidentiality term is reasonable. However, no explicit reference to RA 10173 Data Privacy Act obligations for personal data processing.'
      },
    ],
    risks: [
      {
        severity: 'MEDIUM',
        description: 'Data Privacy provisions insufficient — no explicit RA 10173 compliance clause or Data Processing Agreement',
        affectedClause: 'Section 9 (Confidentiality)',
        recommendation: 'Add a dedicated Data Privacy clause referencing RA 10173 and requiring execution of a Data Processing Agreement (DPA) as an exhibit.'
      },
      {
        severity: 'MEDIUM',
        description: 'IP carve-out for pre-existing software and open-source libraries is absent',
        affectedClause: 'Section 8 (Intellectual Property)',
        recommendation: 'Add an IP carve-out provision listing pre-existing IP and specifying license grants for open-source components. Reference RA 8293 compliance.'
      },
      {
        severity: 'LOW',
        description: 'Dispute resolution clause references courts only — no mention of alternative dispute resolution (ADR)',
        affectedClause: 'Section 14 (Dispute Resolution)',
        recommendation: 'Consider adding an ADR escalation step under RA 9285 (ADR Act) before litigation to reduce costs and preserve business relationship.'
      },
    ],
    complianceFlags: [
      { law: 'RA 10173 – Data Privacy Act', issue: 'No explicit DPA provisions', severity: 'MEDIUM', compliant: false },
      { law: 'RA 8293 – IP Code', issue: 'No IP carve-out for pre-existing works', severity: 'MEDIUM', compliant: false },
      { law: 'RA 386 – Civil Code', issue: '', severity: 'LOW', compliant: true },
      { law: 'RA 9184 – Gov. Procurement Reform', issue: '', severity: 'LOW', compliant: true },
      { law: 'RA 8792 – E-Commerce Act', issue: '', severity: 'LOW', compliant: true },
    ],
    suggestions: [
      {
        priority: 'HIGH',
        suggestion: 'Attach a Data Processing Agreement (DPA) as Exhibit A',
        rationale: 'Required under RA 10173 Section 20 whenever personal data is processed. The NPC has issued templates for government service providers.'
      },
      {
        priority: 'MEDIUM',
        suggestion: 'Add an IP Schedule listing pre-existing software, tools, and open-source components',
        rationale: 'Prevents IP ownership disputes post-project. Protects Service Provider\'s reusable IP and ensures RA 8293 compliance.'
      },
      {
        priority: 'LOW',
        suggestion: 'Include an ADR escalation clause under RA 9285',
        rationale: 'Government contracts benefit from mandatory mediation before litigation to reduce costs and meet COA/OGCC guidelines.'
      },
    ],
  },
  history: [
    { date: '2026-05-08 09:15', action: 'Contract uploaded', user: 'Atty. Michael Santos' },
    { date: '2026-05-08 09:16', action: 'AI analysis initiated', user: 'System' },
    { date: '2026-05-08 09:17', action: 'Analysis completed — Risk: LOW (28/100)', user: 'Contract Agent AI' },
    { date: '2026-05-09 14:30', action: 'Status updated to ANALYZED', user: 'Atty. Michael Santos' },
  ],
}

const TABS = ['Analysis', 'Chat', 'Details', 'Documents', 'History'] as const
type Tab = typeof TABS[number]

const STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'secondary' }> = {
  ANALYZED:       { label: 'Analyzed',       variant: 'success' },
  PENDING_REVIEW: { label: 'Pending Review', variant: 'warning' },
  UPLOADED:       { label: 'Uploaded',       variant: 'info' },
  ANALYZING:      { label: 'Analyzing...',   variant: 'info' },
}

function formatPHP(value: number) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(value)
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState<Tab>('Analysis')
  const [isReanalyzing, setIsReanalyzing] = useState(false)

  const contract = MOCK_CONTRACT // In production: fetch by id

  const handleReanalyze = async () => {
    setIsReanalyzing(true)
    await new Promise(r => setTimeout(r, 2000))
    setIsReanalyzing(false)
  }

  const handleExport = () => {
    alert('PDF report export will be available in the production version with full Anthropic integration.')
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <Link href="/dashboard" className="hover:text-navy-950">Dashboard</Link>
        <span className="mx-2">/</span>
        <Link href="/contracts" className="hover:text-navy-950">Contract Agent</Link>
        <span className="mx-2">/</span>
        <span className="text-navy-950 font-medium truncate">{contract.title}</span>
      </nav>

      {/* Contract Header */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="relative bg-gradient-to-r from-navy-950 to-slate-800 px-6 py-5">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-blue-400 blur-2xl" />
          </div>
          <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {contract.type}
                </span>
                <Badge variant={STATUS_CONFIG[contract.status]?.variant ?? 'secondary'}>
                  {STATUS_CONFIG[contract.status]?.label ?? contract.status}
                </Badge>
                {contract.analysis.scCompliant && (
                  <ComplianceBadge standard="SC-RULES" variant="compact" className="border-amber-400/50 bg-amber-400/10 text-amber-300" />
                )}
              </div>
              <h1 className="text-xl font-bold text-white">{contract.title}</h1>
              <p className="text-sm text-slate-400 mt-1">
                {contract.partyA} ↔ {contract.partyB}
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <RiskGauge score={contract.analysis.overallRiskScore ?? 0} size="md" animated />
            </div>
          </div>
        </div>

        {/* Quick info bar */}
        <div className="flex flex-wrap divide-x divide-gray-100 border-t border-gray-100 bg-gray-50/50">
          {[
            { label: 'Contract Value', value: formatPHP(contract.value) },
            { label: 'Effective', value: formatDate(contract.effectiveDate) },
            { label: 'Expires', value: formatDate(contract.expirationDate) },
            { label: 'Uploaded', value: formatDate(contract.uploadDate) },
          ].map(item => (
            <div key={item.label} className="flex-1 min-w-32 px-4 py-3">
              <p className="text-xs text-gray-400 font-medium">{item.label}</p>
              <p className="text-sm font-semibold text-navy-950">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'Analysis' && <span>🔍</span>}
              {tab === 'Chat' && <span>💬</span>}
              {tab === 'Details' && <span>📋</span>}
              {tab === 'Documents' && <span>📁</span>}
              {tab === 'History' && <span>⏱️</span>}
              {tab}
              {tab === 'Analysis' && (
                <span className="ml-1 rounded-full bg-red-100 text-red-600 text-xs px-1.5 py-0.5 font-bold">
                  {(contract.analysis.risks ?? []).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* ── Analysis Tab ── */}
          {activeTab === 'Analysis' && (
            <AnalysisResults
              analysis={contract.analysis}
              onReanalyze={handleReanalyze}
              onExport={handleExport}
              isLoading={isReanalyzing}
            />
          )}

          {/* ── Chat Tab ── */}
          {activeTab === 'Chat' && (
            <ContractChat
              contractId={contract.id}
              contractTitle={contract.title}
              className="rounded-xl border border-gray-200 overflow-hidden"
            />
          )}

          {/* ── Details Tab ── */}
          {activeTab === 'Details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-navy-950 flex items-center gap-2">
                    <span>📋</span> Contract Metadata
                  </h3>
                  <dl className="space-y-3">
                    {[
                      { label: 'Contract ID', value: contract.id },
                      { label: 'Type', value: contract.type },
                      { label: 'Status', value: contract.status },
                      { label: 'Value', value: formatPHP(contract.value) },
                      { label: 'Governing Law', value: 'Philippine Law' },
                      { label: 'Jurisdiction', value: 'RTC – Philippines' },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-start text-sm border-b border-gray-100 pb-2">
                        <dt className="text-gray-500 font-medium">{item.label}</dt>
                        <dd className="text-navy-950 font-semibold text-right">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-navy-950 flex items-center gap-2">
                    <span>👥</span> Parties
                  </h3>
                  <div className="space-y-3">
                    {[
                      { role: 'Party A', name: contract.partyA },
                      { role: 'Party B', name: contract.partyB },
                    ].map(p => (
                      <div key={p.role} className="rounded-xl border border-gray-200 p-3 bg-gray-50">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{p.role}</p>
                        <p className="text-sm font-semibold text-navy-950 mt-0.5">{p.name}</p>
                      </div>
                    ))}
                  </div>
                  {contract.linkedCase && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                      <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Linked Case</p>
                      <Link href={`/cases/${contract.linkedCase.id}`} className="text-sm font-semibold text-blue-700 hover:underline mt-0.5 block">
                        {contract.linkedCase.caseNumber} – {contract.linkedCase.title}
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Important Dates */}
              <div>
                <h3 className="font-bold text-navy-950 flex items-center gap-2 mb-3">
                  <span>📅</span> Important Dates
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Upload Date', value: formatDate(contract.uploadDate) },
                    { label: 'Effective Date', value: formatDate(contract.effectiveDate) },
                    { label: 'Expiration Date', value: formatDate(contract.expirationDate), alert: true },
                  ].map(d => (
                    <div key={d.label} className={`rounded-xl border p-3 ${d.alert ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-white'}`}>
                      <p className="text-xs text-gray-400 font-medium">{d.label}</p>
                      <p className={`text-sm font-semibold mt-0.5 ${d.alert ? 'text-amber-700' : 'text-navy-950'}`}>{d.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Documents Tab ── */}
          {activeTab === 'Documents' && (
            <div className="space-y-5">
              <h3 className="font-bold text-navy-950">Contract Documents</h3>
              <div className="space-y-3">
                {/* Original file */}
                <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 flex-shrink-0">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy-950 text-sm">{contract.fileName}</p>
                    <p className="text-xs text-gray-500">{formatBytes(contract.fileSize)} · PDF · Original Upload</p>
                  </div>
                  <button type="button" className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    View
                  </button>
                </div>

                {/* Generated report */}
                <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 flex-shrink-0">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-green-900 text-sm">AI Analysis Report – {contract.title}</p>
                    <p className="text-xs text-green-600">Generated {formatDate(contract.uploadDate)} · PDF · AI Generated</p>
                  </div>
                  <button type="button" onClick={handleExport} className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-navy-950 mb-4">Generate from Template</h3>
                <TemplateGenerator />
              </div>
            </div>
          )}

          {/* ── History Tab ── */}
          {activeTab === 'History' && (
            <div className="space-y-4">
              <h3 className="font-bold text-navy-950">Contract History</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-4 pl-10">
                  {contract.history.map((event, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full bg-blue-500 border-2 border-white shadow" />
                      <div className="rounded-xl border border-gray-200 bg-white p-3">
                        <p className="text-sm font-semibold text-navy-950">{event.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">{event.date}</p>
                          <span className="text-gray-300">·</span>
                          <p className="text-xs text-blue-600">{event.user}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis history */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mt-4">
                <h4 className="font-semibold text-navy-950 text-sm mb-3">Analysis History</h4>
                <div className="flex items-center justify-between rounded-lg bg-white border border-gray-200 p-3">
                  <div>
                    <p className="text-sm font-semibold text-navy-950">Full Analysis #1</p>
                    <p className="text-xs text-gray-500">May 8, 2026 09:17 · claude-3-5-sonnet</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiskGauge score={28} size="sm" showLabel={false} />
                    <Badge variant="success" size="sm">LOW</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
