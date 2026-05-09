// Quanby Case Management Platform – Compliance Badge Component
// Displays Supreme Court of the Philippines compliance certification badge

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { ComplianceBadgeProps } from '@/types'

const STANDARD_CONFIG: Record<
  ComplianceBadgeProps['standard'],
  { label: string; sublabel: string; color: string }
> = {
  'SC-RULES': {
    label: 'SC Rules Compliant',
    sublabel: 'Supreme Court of the Philippines',
    color: 'gold',
  },
  'RA-10173': {
    label: 'RA 10173',
    sublabel: 'Data Privacy Act Compliant',
    color: 'navy',
  },
  NIST: {
    label: 'NIST SP 800-53',
    sublabel: 'Security Controls',
    color: 'navy',
  },
  'ISO-27001': {
    label: 'ISO 27001',
    sublabel: 'Information Security',
    color: 'navy',
  },
  OWASP: {
    label: 'OWASP Top 10',
    sublabel: 'Application Security',
    color: 'navy',
  },
}

export function ComplianceBadge({ standard, variant = 'default', className }: ComplianceBadgeProps) {
  const config = STANDARD_CONFIG[standard]
  const isGold = config.color === 'gold'

  if (variant === 'icon-only') {
    return (
      <div
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-full border-2',
          isGold
            ? 'border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-900/20 dark:text-amber-400'
            : 'border-slate-700 bg-slate-900 text-white dark:border-slate-600',
          className
        )}
        title={`${config.label} – ${config.sublabel}`}
        aria-label={`${config.label} – ${config.sublabel}`}
      >
        <ScalesIcon className="h-4 w-4" />
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
          isGold
            ? 'border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-500 dark:bg-amber-900/20 dark:text-amber-400'
            : 'border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
          className
        )}
      >
        <ScalesIcon className="h-3 w-3" />
        <span>{config.label}</span>
      </div>
    )
  }

  // default: full badge
  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 rounded-lg border px-4 py-3',
        isGold
          ? 'border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 dark:border-amber-700 dark:from-amber-900/20 dark:to-yellow-900/20'
          : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50',
        className
      )}
      role="img"
      aria-label={`${config.label} – ${config.sublabel}`}
    >
      {/* Shield icon */}
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          isGold
            ? 'bg-amber-500 text-white'
            : 'bg-slate-900 text-white dark:bg-slate-700'
        )}
      >
        <ShieldIcon className="h-5 w-5" />
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span
          className={cn(
            'text-sm font-bold leading-tight',
            isGold
              ? 'text-amber-800 dark:text-amber-300'
              : 'text-slate-900 dark:text-slate-100'
          )}
        >
          {config.label}
        </span>
        <span
          className={cn(
            'text-xs leading-tight',
            isGold
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-slate-500 dark:text-slate-400'
          )}
        >
          {config.sublabel}
        </span>
      </div>

      {/* Verified checkmark */}
      <div
        className={cn(
          'ml-auto flex h-5 w-5 items-center justify-center rounded-full',
          isGold ? 'bg-amber-500' : 'bg-emerald-500'
        )}
        aria-hidden="true"
      >
        <svg
          className="h-3 w-3 text-white"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 6L4.5 8.5L10 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

// ─── Internal SVG Icons ────────────────────────────────────────────────────────

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12L11 14L15 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ScalesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 3V21M12 3L6 8M12 3L18 8M6 8L4 17H8L6 8ZM18 8L16 17H20L18 8ZM4 21H20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── Supreme Court specific badge ─────────────────────────────────────────────

export function SupremeCourtBadge({ className }: { className?: string }) {
  return (
    <ComplianceBadge
      standard="SC-RULES"
      variant="default"
      className={className}
    />
  )
}

export function ComplianceBadgeRow({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <ComplianceBadge standard="SC-RULES" variant="compact" />
      <ComplianceBadge standard="RA-10173" variant="compact" />
      <ComplianceBadge standard="NIST" variant="compact" />
      <ComplianceBadge standard="ISO-27001" variant="compact" />
    </div>
  )
}
