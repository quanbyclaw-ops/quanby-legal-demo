'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { CaseTimeline, User } from '@/types'

type TimelineEvent = CaseTimeline & {
  createdBy?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'> | null
}

interface CaseTimelineProps {
  caseId: string
  events: TimelineEvent[]
  onEventAdded?: (event: TimelineEvent) => void
}

const EVENT_CONFIG: Record<string, { icon: string; color: string; bgColor: string }> = {
  CASE_CREATED:     { icon: '🏛️', color: 'text-blue-600',   bgColor: 'bg-blue-50 border-blue-200' },
  STATUS_CHANGED:   { icon: '🔄', color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-200' },
  LAWYER_ASSIGNED:  { icon: '👨‍⚖️', color: 'text-navy-700',  bgColor: 'bg-navy-50 border-navy-200' },
  HEARING_SCHEDULED:{ icon: '📅', color: 'text-amber-600',  bgColor: 'bg-amber-50 border-amber-200' },
  DOCUMENT_FILED:   { icon: '📄', color: 'text-green-600',  bgColor: 'bg-green-50 border-green-200' },
  DOCUMENT_RECEIVED:{ icon: '📥', color: 'text-teal-600',   bgColor: 'bg-teal-50 border-teal-200' },
  TASK_COMPLETED:   { icon: '✅', color: 'text-emerald-600', bgColor: 'bg-emerald-50 border-emerald-200' },
  NOTE_ADDED:       { icon: '📝', color: 'text-gray-600',   bgColor: 'bg-gray-50 border-gray-200' },
  DEADLINE_SET:     { icon: '⏰', color: 'text-red-600',    bgColor: 'bg-red-50 border-red-200' },
  CLIENT_CONTACTED: { icon: '📞', color: 'text-indigo-600', bgColor: 'bg-indigo-50 border-indigo-200' },
  COURT_ORDER:      { icon: '⚖️', color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-200' },
  PAYMENT_RECEIVED: { icon: '💰', color: 'text-green-700',  bgColor: 'bg-green-50 border-green-200' },
}

function formatRelativeTime(date: string | Date): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function CaseTimeline({ caseId, events, onEventAdded }: CaseTimelineProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [noteTitle, setNoteTitle] = useState('')
  const [noteDescription, setNoteDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddNote = async () => {
    if (!noteTitle.trim()) return
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/cases/${caseId}/timeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'NOTE_ADDED', title: noteTitle, description: noteDescription }),
      })
      const json = await res.json()
      if (json.success && onEventAdded) {
        onEventAdded(json.data)
      }
      setNoteTitle('')
      setNoteDescription('')
      setIsDialogOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Case Timeline</h3>
        <Button
          size="sm"
          variant="outline"
          className="border-navy-200 text-navy-700 hover:bg-navy-50"
          onClick={() => setIsDialogOpen(true)}
        >
          + Add Note
        </Button>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-4">
          {events.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">No timeline events yet.</div>
          )}
          {events.map((event) => {
            const config = EVENT_CONFIG[event.eventType] ?? EVENT_CONFIG.NOTE_ADDED
            return (
              <div key={event.id} className="relative flex gap-4 pl-4">
                {/* Icon bubble */}
                <div
                  className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 text-base ${config.bgColor}`}
                >
                  <span>{config.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-lg border border-gray-100 p-4 shadow-sm min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={`font-medium text-sm ${config.color}`}>{event.title}</p>
                      {event.description && (
                        <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                      {formatRelativeTime(event.createdAt)}
                    </span>
                  </div>
                  {event.createdBy && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-navy-100 flex items-center justify-center text-xs font-bold text-navy-700">
                        {event.createdBy.firstName[0]}
                      </div>
                      <span className="text-xs text-gray-400">
                        {event.createdBy.firstName} {event.createdBy.lastName}
                      </span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">
                        {new Date(event.createdAt).toLocaleString('en-PH', {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: 'numeric', minute: '2-digit', hour12: true,
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy-950">Add Timeline Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Title *</label>
              <Input
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="e.g. Client meeting conducted"
                className="border-gray-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description</label>
              <Textarea
                value={noteDescription}
                onChange={(e) => setNoteDescription(e.target.value)}
                placeholder="Additional details..."
                rows={3}
                className="border-gray-200 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAddNote}
              disabled={!noteTitle.trim() || isSubmitting}
              className="bg-navy-950 hover:bg-navy-800 text-white"
            >
              {isSubmitting ? 'Adding...' : 'Add Note'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
