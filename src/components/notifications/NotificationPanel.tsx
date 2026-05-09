'use client'

import * as React from 'react'
import { Bell, Check, CheckCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NotificationItem, type NotificationData } from './NotificationItem'
import { cn } from '@/lib/utils'

// ─── Mock notifications ────────────────────────────────────────────────────────

const INITIAL_NOTIFICATIONS: NotificationData[] = [
  {
    id: '1',
    type: 'deadline',
    title: 'Deadline Approaching',
    message: 'QLP-2025-CIV-042 reglementary period ends in 3 days. File answer immediately.',
    timestamp: '5m ago',
    read: false,
    href: '/cases',
  },
  {
    id: '2',
    type: 'contract_analyzed',
    title: 'Contract Analysis Complete',
    message: 'Service Agreement v2 analyzed. Risk score: 42 (Medium). Review recommendations.',
    timestamp: '1h ago',
    read: false,
    href: '/contracts',
  },
  {
    id: '3',
    type: 'case_update',
    title: 'Case Status Updated',
    message: 'QLP-2025-LAB-018 moved to Awaiting Hearing. Next date: June 18, 2025.',
    timestamp: '2h ago',
    read: false,
    href: '/cases',
  },
  {
    id: '4',
    type: 'new_document',
    title: 'New Document Uploaded',
    message: 'Judicial Affidavit for QLP-2025-FAM-009 has been uploaded by Atty. Ana Cruz.',
    timestamp: '4h ago',
    read: true,
    href: '/documents',
  },
  {
    id: '5',
    type: 'task_assigned',
    title: 'Task Assigned to You',
    message: 'Draft memorandum on appeal for QLP-2025-CIV-033. Due: June 20, 2025.',
    timestamp: '1d ago',
    read: true,
    href: '/cases',
  },
  {
    id: '6',
    type: 'deadline',
    title: 'Prescription Period Warning',
    message: 'Quasi-delict claim for QLP-2025-CIV-051 — 4-year prescriptive period ending in 30 days.',
    timestamp: '2d ago',
    read: true,
    href: '/cases',
  },
]

interface NotificationPanelProps {
  /** Controlled open state (optional). If not provided, component manages its own state. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Trigger element to attach the panel to. Defaults to a Bell button. */
  trigger?: React.ReactNode
  className?: string
}

export function NotificationPanel({ open: controlledOpen, onOpenChange, trigger, className }: NotificationPanelProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [notifications, setNotifications] = React.useState<NotificationData[]>(INITIAL_NOTIFICATIONS)
  const panelRef = React.useRef<HTMLDivElement>(null)

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = (v: boolean) => {
    setInternalOpen(v)
    onOpenChange?.(v)
  }

  const unread = notifications.filter((n) => !n.read)
  const unreadCount = unread.length

  // Close on outside click
  React.useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  function markRead(id: string) {
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  function markAllRead() {
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })))
  }

  function handleItemClick(n: NotificationData) {
    markRead(n.id)
    setOpen(false)
    // In a real app: router.push(n.href ?? '/')
  }

  return (
    <div ref={panelRef} className={cn('relative', className)}>
      {/* Trigger */}
      {trigger ? (
        <div onClick={() => setOpen(!isOpen)}>{trigger}</div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label={`Notifications (${unreadCount} unread)`}
          onClick={() => setOpen(!isOpen)}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold leading-none text-white animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      )}

      {/* Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-slate-700 dark:text-slate-300" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 px-2 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  onClick={markAllRead}
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                onClick={() => setOpen(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Notification list */}
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Bell className="h-8 w-8 text-slate-200 dark:text-slate-700 mb-2" />
                <p className="text-sm text-slate-400">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onClick={handleItemClick}
                    onMarkRead={markRead}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-4 py-2.5 dark:border-slate-800">
            <button className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
