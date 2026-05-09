'use client'

// Quanby Legal Platform – Analysis Results Component
// Renders full contract AI analysis: clauses, risks, compliance, suggestions

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { RiskGauge } from './RiskGauge'
import { cn } from '@/lib/utils'

interface KeyClause {
  title: string
  text: string
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  section?: string
  explanation?: string
}

interface RiskItem {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  description: string
  recommendation: string
  affectedClause?: string
}

interface ComplianceFlag {
  law: string
  issue: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  compliant: boolean
}

interface Suggestion {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  suggestion: string
  rationale: string
}

export interface AnalysisData {
  overallRiskScore?: number | null
  riskLevel?: string | null
  scCompliant?: boolean | null
  summary?: string | null
  keyClauses?: KeyClause[] | null
  risks?: RiskItem[] | null
  complianceFlags?: ComplianceFlag[] | null
  suggestions?: Suggestion[] | null
}

interface AnalysisResultsProps {
  analysis: AnalysisData
  onReanalyze?: () => void
  onExport?: () => void
  isLoading?: boolean
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, 'destructive' | 'warning' | 'info' | 'secondary'> = {
    CRITICAL: 'destructive',
    HIGH: 'warning',
    MEDIUM: 'info',
    LOW: 'secondary',
  }
  return <Badge variant={map[severity] ?? 'secondary'}>{severity}</Badge>
}

function RiskLevelBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
    MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    LOW: 'bg-green-100 text-green-700 border-green-200',
    CRITICAL: 'bg-red-100 text-red-700 border-red-200',
  }
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold', map[level] ?? 'bg-gray-100 text-gray-600')}>
      {level}
    </span>
  )
}

function ClauseCard({ clause, index }: { clause: KeyClause; index: number }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-950 text-white text-xs font-bold flex-shrink-0">
            {index + 1}
          </span>
          <div>
            <p className="font-semibold text-navy-950 text-sm">{clause.title}</p>
            {clause.section && <p className="text-xs text-gray-500">{clause.section}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RiskLevelBadge level={clause.riskLevel} />
          <svg className={cn('h-4 w-4 text-gray-400 transition-transform', expanded && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 space-y-3">
          <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Extracted Text</p>
            <p className="text-sm text-slate-700 italic leading-relaxed">&ldquo;{clause.text}&rdquo;</p>
          </div>
          {clause.explanation && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Analysis</p>
              <p className="text-sm text-blue-900">{clause.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RiskCard({ risk }: { risk: RiskItem }) {
  const iconMap: Record<string, string> = {
    CRITICAL: '🚨',
    HIGH: '⚠️',
    MEDIUM: '⚡',
    LOW: '💡',
  }
  const bgMap: Record<string, string> = {
    CRITICAL: 'border-red-200 bg-red-50',
    HIGH: 'border-orange-200 bg-orange-50',
    MEDIUM: 'border-yellow-200 bg-yellow-50',
    LOW: 'border-blue-200 bg-blue-50',
  }
  return (
    <div className={cn('rounded-xl border p-4 space-y-2', bgMap[risk.severity] ?? 'border-gray-200 bg-gray-50')}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1">
          <span className="text-lg flex-shrink-0">{iconMap[risk.severity]}</span>
          <p className="text-sm font-semibold text-gray-900">{risk.description}</p>
        </div>
        <SeverityBadge severity={risk.severity} />
      </div>
      {risk.affectedClause && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span className="font-medium">Clause:</span> {risk.affectedClause}
        </p>
      )}
      <div className="rounded-lg bg-white/70 border border-white/50 p-2.5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Recommendation</p>
        <p className="text-sm text-gray-700">{risk.recommendation}</p>
      </div>
    </div>
  )
}

const PH_COMPLIANCE_LAWS = [
  { law: 'RA 386 – Civil Code', key: 'ra386' },
  { law: 'RA 8293 – IP Code', key: 'ra8293' },
  { law: 'RA 10173 – Data Privacy Act', key: 'ra10173' },
  { law: 'RA 7394 – Consumer Act', key: 'ra7394' },
  { law: 'RA 8792 – E-Commerce Act', key: 'ra8792' },
  { law: 'RA 9285 – ADR Act', key: 'ra9285' },
]

export function AnalysisResults({ analysis, onReanalyze, onExport, isLoading }: AnalysisResultsProps) {
  const score = analysis.overallRiskScore ?? analysis.riskLevel === 'CRITICAL' ? 85 : analysis.riskLevel === 'HIGH' ? 70 : analysis.riskLevel === 'MEDIUM' ? 45 : 20
  const keyClauses = (analysis.keyClauses ?? []) as KeyClause[]
  const risks = (analysis.risks ?? []) as RiskItem[]
  const complianceFlags = (analysis.complianceFlags ?? []) as ComplianceFlag[]
  const suggestions = (analysis.suggestions ?? []) as Suggestion[]

  const scStatus = analysis.scCompliant === true ? 'COMPLIANT' : analysis.scCompliant === false ? 'NON_COMPLIANT' : 'NEEDS_REVIEW'

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-navy-950">AI Analysis Report</h3>
        <div className="flex gap-2">
          {onReanalyze && (
            <button
              type="button"
              onClick={onReanalyze}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className={cn('h-4 w-4', isLoading && 'animate-spin')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Re-analyze
            </button>
          )}
          {onExport && (
            <button
              type="button"
              onClick={onExport}
              className="flex items-center gap-1.5 rounded-lg bg-navy-950 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
          )}
        </div>
      </div>

      {/* Hero: Risk Score + SC Compliance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1 flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <RiskGauge score={typeof score === 'number' ? score : 35} size="lg" animated />
        </div>
        <div className="sm:col-span-2 grid grid-cols-2 gap-4">
          {/* SC Compliance */}
          <div className={cn(
            'rounded-2xl border p-4 flex flex-col justify-between',
            scStatus === 'COMPLIANT' ? 'border-green-200 bg-green-50' :
            scStatus === 'NON_COMPLIANT' ? 'border-red-200 bg-red-50' :
            'border-amber-200 bg-amber-50'
          )}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">SC Compliance</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {scStatus === 'COMPLIANT' ? '✅' : scStatus === 'NON_COMPLIANT' ? '❌' : '⚠️'}
              </span>
              <div>
                <p className={cn('text-sm font-bold',
                  scStatus === 'COMPLIANT' ? 'text-green-700' :
                  scStatus === 'NON_COMPLIANT' ? 'text-red-700' : 'text-amber-700'
                )}>
                  {scStatus === 'COMPLIANT' ? 'Compliant' : scStatus === 'NON_COMPLIANT' ? 'Non-Compliant' : 'Needs Review'}
                </p>
                <p className="text-xs text-gray-500">Supreme Court Rules</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Identified Issues</p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-red-600 font-medium">Critical</span>
                <span className="font-bold text-navy-950">{risks.filter(r => r.severity === 'CRITICAL').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-orange-600 font-medium">High</span>
                <span className="font-bold text-navy-950">{risks.filter(r => r.severity === 'HIGH').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-yellow-600 font-medium">Medium</span>
                <span className="font-bold text-navy-950">{risks.filter(r => r.severity === 'MEDIUM').length}</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-1">AI Summary</p>
            <p className="text-sm text-blue-900 line-clamp-3">{analysis.summary ?? 'Contract analysis complete. Review the sections below for detailed findings.'}</p>
          </div>
        </div>
      </div>

      {/* Key Clauses */}
      {keyClauses.length > 0 && (
        <section>
          <h4 className="flex items-center gap-2 text-base font-bold text-navy-950 mb-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-navy-950 text-white text-xs">📋</span>
            Key Clauses
            <span className="ml-auto text-xs text-gray-400 font-normal">{keyClauses.length} identified</span>
          </h4>
          <div className="space-y-2">
            {keyClauses.map((clause, i) => (
              <ClauseCard key={i} clause={clause} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Risks */}
      {risks.length > 0 && (
        <section>
          <h4 className="flex items-center gap-2 text-base font-bold text-navy-950 mb-3">
            <span className="text-lg">⚠️</span>
            Risk Assessment
            <span className="ml-auto text-xs text-gray-400 font-normal">{risks.length} risks found</span>
          </h4>
          <div className="space-y-3">
            {risks.map((risk, i) => <RiskCard key={i} risk={risk} />)}
          </div>
        </section>
      )}

      {/* Compliance Flags */}
      <section>
        <h4 className="flex items-center gap-2 text-base font-bold text-navy-950 mb-3">
          <span className="text-lg">🇵🇭</span>
          Philippine Law Compliance
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PH_COMPLIANCE_LAWS.map(({ law }) => {
            const flag = complianceFlags.find(f => f.law.includes(law.split('–')[0].trim()))
            const isCompliant = flag ? flag.compliant : true
            const hasIssue = flag && !flag.compliant
            return (
              <div
                key={law}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-3',
                  hasIssue ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                )}
              >
                <span className="mt-0.5 text-sm flex-shrink-0">{hasIssue ? '❌' : '✅'}</span>
                <div>
                  <p className={cn('text-xs font-semibold', hasIssue ? 'text-red-700' : 'text-green-700')}>{law}</p>
                  {hasIssue && flag && (
                    <p className="text-xs text-red-600 mt-0.5">{flag.issue}</p>
                  )}
                </div>
              </div>
            )
          })}
          {/* Extra flags from analysis */}
          {complianceFlags.filter(f => !PH_COMPLIANCE_LAWS.some(l => f.law.includes(l.law.split('–')[0].trim()))).map((flag, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-3 rounded-xl border p-3',
                !flag.compliant ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
              )}
            >
              <span className="mt-0.5 text-sm flex-shrink-0">{flag.compliant ? '✅' : '❌'}</span>
              <div>
                <p className={cn('text-xs font-semibold', !flag.compliant ? 'text-red-700' : 'text-green-700')}>{flag.law}</p>
                {!flag.compliant && <p className="text-xs text-red-600 mt-0.5">{flag.issue}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <section>
          <h4 className="flex items-center gap-2 text-base font-bold text-navy-950 mb-3">
            <span className="text-lg">💡</span>
            Improvement Suggestions
          </h4>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <div key={i} className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-navy-950 text-white text-sm font-bold">
                  {i + 1}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-navy-950">{s.suggestion}</p>
                    <SeverityBadge severity={s.priority} />
                  </div>
                  <p className="text-sm text-gray-600">{s.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
