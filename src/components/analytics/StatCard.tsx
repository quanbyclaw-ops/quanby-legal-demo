'use client'

import * as React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: number          // percentage change, positive = up, negative = down
  trendLabel?: string
  description?: string
  className?: string
  gradient?: string
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendLabel,
  description,
  className,
  gradient = 'from-blue-600/10 to-blue-800/5',
}: StatCardProps) {
  const isPositive = trend !== undefined && trend > 0
  const isNegative = trend !== undefined && trend < 0
  const isNeutral  = trend !== undefined && trend === 0

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900',
        className
      )}
    >
      {/* Gradient background accent */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-40 dark:opacity-20',
          gradient
        )}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-4">
        {/* Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
          {icon}
        </div>

        {/* Trend badge */}
        {trend !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
              isPositive && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
              isNegative && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
              isNeutral  && 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            )}
          >
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            {isNeutral  && <Minus className="h-3 w-3" />}
            {trend !== 0 ? `${Math.abs(trend)}%` : 'No change'}
          </div>
        )}
      </div>

      <div className="relative mt-4">
        <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
        {(trendLabel || description) && (
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            {trendLabel ?? description}
          </p>
        )}
      </div>
    </div>
  )
}
