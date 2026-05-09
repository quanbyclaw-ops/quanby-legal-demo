'use client'

import * as React from 'react'
import { Clock, FileText, Briefcase, CheckSquare, Brain, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NotificationType = 'deadline' | 'case_update' | 'new_document' | 'task_assigned' | 'contract_analyzed' | 'general'

export interface NotificationData {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  href?: string
}

interface NotificationItemProps {
  notification: NotificationData
  onClick?: (n: NotificationData) => void
  onMarkRead?: (id: string) => void
}

const TYPE_ICONS: Record<NotificationType, React.ReactNode> = {
  deadline:           <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
  case_update:        <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  new_document:       <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />,
  task_assigned:      <CheckSquare className="h-4 w-4 text-teal-600 dark:text-teal-400" />,
  contract_analyzed:  <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
  general:            <Bell className="h-4 w-4 text-slate-500 dark:text-slate-400" />,
}

const TYPE_BG: Record<NotificationType, string> = {
  deadline:          'bg-amber-50 dark:bg-amber-900/20',
  case_update:       'bg-blue-50 dark:bg-blue-900/20',
  new_document:      'bg-indigo-50 dark:bg-indigo-900/20',
  task_assigned:     'bg-teal-50 dark:bg-teal-900/20',
  contract_analyzed: 'bg-purple-50 dark:bg-purple-900/20',
  general:           'bg-slate-50 dark:bg-slate-800',
}

export function NotificationItem({ notification: n, onClick, onMarkRead }: NotificationItemProps) {
  return (
    <div
      className={cn(
        'flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors',
        !n.read && 'bg-blue-50/70 dark:bg-blue-950/30',
        'hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
      )}
      onClick={() => onClick?.(n)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(n)}
    >
      {/* Icon */}
      <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', TYPE_BG[n.type])}>
        {TYPE_ICONS[n.type]}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm leading-snug', n.read ? 'font-medium text-slate-700 dark:text-slate-300' : 'font-semibold text-slate-900 dark:text-white')}>
            {n.title}
          </p>
          <span className="shrink-0 text-[10px] text-slate-400">{n.timestamp}</span>
        </div>
        <p className="mt-0.5 text-xs leading-snug text-slate-500 dark:text-slate-400 line-clamp-2">
          {n.message}
        </p>
      </div>

      {/* Unread dot */}
      {!n.read && (
        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" aria-label="Unread" />
      )}
    </div>
  )
}
