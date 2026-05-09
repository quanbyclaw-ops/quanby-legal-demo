'use client'

import * as React from 'react'
import { Calendar, User, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ClientCaseCardProps {
  caseNumber: string
  title: string
  type: string
  status: string
  statusColor: string
  progress: number      // 0-100
  lastUpdate: string
  lawyerName: string
  lawyerEmail?: string
  onViewDetails?: () => void
}

export function ClientCaseCard({
  caseNumber,
  title,
  type,
  status,
  statusColor,
  progress,
  lastUpdate,
  lawyerName,
  lawyerEmail,
  onViewDetails,
}: ClientCaseCardProps) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-700">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">{caseNumber}</span>
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', statusColor)}>
              {status}
            </span>
          </div>
          <h3 className="mt-1 text-sm font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{type}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
          <span>Case Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>Updated {lastUpdate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <User className="h-3 w-3 shrink-0" />
            <span>{lawyerName}</span>
            {lawyerEmail && (
              <a href={`mailto:${lawyerEmail}`} className="text-blue-600 hover:underline dark:text-blue-400 ml-1">
                Contact
              </a>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-1 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
          onClick={onViewDetails}
        >
          View Details
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
