'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface BarChartDataPoint {
  label: string
  value: number
  color?: string
}

interface BarChartProps {
  data: BarChartDataPoint[]
  orientation?: 'horizontal' | 'vertical'
  maxValue?: number
  showValues?: boolean
  color?: string
  className?: string
  barHeight?: number
  title?: string
}

export function BarChart({
  data,
  orientation = 'horizontal',
  maxValue,
  showValues = true,
  color = 'bg-blue-600',
  className,
  barHeight = 28,
  title,
}: BarChartProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1)

  if (orientation === 'vertical') {
    return (
      <div className={cn('w-full', className)}>
        {title && <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>}
        <div className="flex items-end justify-between gap-2" style={{ height: 160 }}>
          {data.map((item) => {
            const pct = (item.value / max) * 100
            return (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                  {showValues ? item.value : ''}
                </span>
                <div className="relative w-full rounded-t-md overflow-hidden bg-slate-100 dark:bg-slate-800" style={{ height: 120 }}>
                  <div
                    className={cn('absolute bottom-0 left-0 right-0 rounded-t-md transition-all duration-700 ease-out', item.color ?? color)}
                    style={{ height: mounted ? `${pct}%` : '0%' }}
                  />
                </div>
                <span className="text-center text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Horizontal
  return (
    <div className={cn('w-full space-y-2', className)}>
      {title && <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>}
      {data.map((item) => {
        const pct = (item.value / max) * 100
        return (
          <div key={item.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 truncate text-xs text-slate-600 dark:text-slate-400 text-right">
              {item.label}
            </span>
            <div
              className="relative flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
              style={{ height: barHeight }}
            >
              <div
                className={cn(
                  'absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out',
                  item.color ?? color
                )}
                style={{ width: mounted ? `${pct}%` : '0%' }}
              />
            </div>
            {showValues && (
              <span className="w-10 shrink-0 text-xs font-semibold text-slate-700 dark:text-slate-300 text-right">
                {item.value}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
