'use client'

import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EligibilityCriterion {
  id: string
  label: string
  description: string
  status: 'pass' | 'fail' | 'warning' | 'pending'
  note?: string
  phReference?: string
}

export interface EligibilityScreenerProps {
  criteria: EligibilityCriterion[]
  onChange?: (id: string, status: 'pass' | 'fail' | 'warning') => void
  readOnly?: boolean
  className?: string
}

export type EligibilityResult = 'ELIGIBLE' | 'NEEDS_REVIEW' | 'NOT_ELIGIBLE'

export function computeEligibility(criteria: EligibilityCriterion[]): EligibilityResult {
  const fails = criteria.filter(c => c.status === 'fail').length
  const warnings = criteria.filter(c => c.status === 'warning').length
  const pending = criteria.filter(c => c.status === 'pending').length
  if (fails > 0) return 'NOT_ELIGIBLE'
  if (warnings > 0 || pending > 0) return 'NEEDS_REVIEW'
  return 'ELIGIBLE'
}

const STATUS_CONFIG = {
  pass: {
    icon: CheckCircle2,
    iconClass: 'text-emerald-500',
    rowClass: 'border-emerald-100 bg-emerald-50/40',
    label: 'Pass',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  fail: {
    icon: XCircle,
    iconClass: 'text-red-500',
    rowClass: 'border-red-100 bg-red-50/40',
    label: 'Fail',
    badgeClass: 'bg-red-100 text-red-800 border-red-200',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-amber-500',
    rowClass: 'border-amber-100 bg-amber-50/40',
    label: 'Warning',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  pending: {
    icon: Info,
    iconClass: 'text-slate-400',
    rowClass: 'border-slate-100 bg-slate-50/40',
    label: 'Pending',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
  },
}

const RESULT_CONFIG = {
  ELIGIBLE: {
    label: 'Eligible for Representation',
    description: 'Client meets all eligibility criteria. Proceed to case assignment.',
    className: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CheckCircle2,
    iconClass: 'text-emerald-500',
  },
  NEEDS_REVIEW: {
    label: 'Requires Senior Review',
    description: 'One or more criteria require attorney review before proceeding.',
    className: 'bg-amber-50 border-amber-200 text-amber-900',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: AlertTriangle,
    iconClass: 'text-amber-500',
  },
  NOT_ELIGIBLE: {
    label: 'Not Eligible',
    description: 'Client does not meet mandatory eligibility criteria. Consider referral to PAO or other counsel.',
    className: 'bg-red-50 border-red-200 text-red-900',
    badgeClass: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    iconClass: 'text-red-500',
  },
}

export function EligibilityScreener({
  criteria,
  onChange,
  readOnly = false,
  className,
}: EligibilityScreenerProps) {
  const result = computeEligibility(criteria)
  const rc = RESULT_CONFIG[result]
  const ResultIcon = rc.icon

  return (
    <div className={cn('space-y-4', className)}>
      {/* Criteria list */}
      <div className="space-y-2">
        {criteria.map((criterion) => {
          const cfg = STATUS_CONFIG[criterion.status]
          const StatusIcon = cfg.icon
          return (
            <div
              key={criterion.id}
              className={cn(
                'flex items-start gap-3 rounded-lg border px-4 py-3 transition-colors',
                cfg.rowClass
              )}
            >
              <StatusIcon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', cfg.iconClass)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-sm font-medium text-slate-800">{criterion.label}</span>
                  {!readOnly && onChange ? (
                    <div className="flex gap-1">
                      {(['pass', 'warning', 'fail'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => onChange(criterion.id, s)}
                          className={cn(
                            'text-xs px-2 py-0.5 rounded border font-medium transition-colors',
                            criterion.status === s
                              ? STATUS_CONFIG[s].badgeClass + ' font-semibold'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          )}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded border font-medium',
                        cfg.badgeClass
                      )}
                    >
                      {cfg.label}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{criterion.description}</p>
                {criterion.note && (
                  <p className="text-xs text-slate-600 mt-1 italic">{criterion.note}</p>
                )}
                {criterion.phReference && (
                  <p className="text-xs text-blue-600 mt-0.5">Ref: {criterion.phReference}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Overall result */}
      <div className={cn('rounded-lg border-2 p-4 flex items-start gap-3', rc.className)}>
        <ResultIcon className={cn('h-6 w-6 flex-shrink-0 mt-0.5', rc.iconClass)} />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">Overall Result:</span>
            <span className={cn('text-xs px-2 py-0.5 rounded border font-bold', rc.badgeClass)}>
              {rc.label}
            </span>
          </div>
          <p className="text-sm">{rc.description}</p>
        </div>
      </div>
    </div>
  )
}

// Default PH-specific criteria factory
export function createDefaultCriteria(): EligibilityCriterion[] {
  return [
    {
      id: 'reglementary_period',
      label: 'Within Reglementary Period',
      description: 'Action is not yet time-barred; applicable prescriptive period has not lapsed.',
      status: 'pending',
      phReference: 'Rules of Court, Rule 11; Civil Code Art. 1139-1150',
    },
    {
      id: 'jurisdiction',
      label: 'Proper Jurisdiction',
      description: 'Court or tribunal has subject-matter and territorial jurisdiction over the dispute.',
      status: 'pending',
      phReference: 'Batas Pambansa Blg. 129; RA 7691',
    },
    {
      id: 'legal_standing',
      label: 'Legal Standing (Locus Standi)',
      description: 'Client has real interest in the subject matter and will sustain direct injury.',
      status: 'pending',
      phReference: 'Rules of Court, Rule 3, Sec. 2',
    },
    {
      id: 'no_forum_shopping',
      label: 'No Forum Shopping',
      description: 'No identical case pending in another court or tribunal; CNFS can be executed.',
      status: 'pending',
      phReference: 'Rules of Court, Rule 7, Sec. 5; SC Circular 28-91',
    },
    {
      id: 'documents_available',
      label: 'Required Documents Available',
      description: 'Client possesses or can produce supporting documents needed to file the case.',
      status: 'pending',
    },
    {
      id: 'means_test',
      label: 'Means Test (PAO/Pro Bono Referral)',
      description:
        'Monthly household income does not exceed ₱18,000 threshold for PAO eligibility; or qualifies for firm pro bono.',
      status: 'pending',
      phReference: 'RA 9406 (PAO Law); IBP Free Legal Aid Rules',
    },
  ]
}
