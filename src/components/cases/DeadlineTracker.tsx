'use client'

import { REGLEMENTARY_PERIODS } from '@/lib/constants'

interface Deadline {
  id: string
  label: string
  date: Date | string
  type?: 'reglementary' | 'hearing' | 'prescription' | 'custom'
  description?: string
}

interface DeadlineTrackerProps {
  deadlines: Deadline[]
  compact?: boolean
}

function getUrgency(date: Date | string): { days: number; hours: number; level: 'red' | 'orange' | 'yellow' | 'green' | 'passed' } {
  const d = new Date(date)
  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  const diffHours = Math.floor((diffMs % 86400000) / 3600000)

  if (diffMs < 0) return { days: diffDays, hours: 0, level: 'passed' }
  if (diffDays < 3)  return { days: diffDays, hours: diffHours, level: 'red' }
  if (diffDays < 7)  return { days: diffDays, hours: diffHours, level: 'orange' }
  if (diffDays < 14) return { days: diffDays, hours: diffHours, level: 'yellow' }
  return { days: diffDays, hours: diffHours, level: 'green' }
}

const URGENCY_STYLES = {
  red:    { bar: 'bg-red-500',    badge: 'bg-red-50 border-red-200',    text: 'text-red-700',    icon: '🚨', label: 'Critical' },
  orange: { bar: 'bg-orange-500', badge: 'bg-orange-50 border-orange-200', text: 'text-orange-700', icon: '⚠️', label: 'Urgent' },
  yellow: { bar: 'bg-yellow-500', badge: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', icon: '🔔', label: 'Upcoming' },
  green:  { bar: 'bg-green-500',  badge: 'bg-green-50 border-green-200',  text: 'text-green-700',  icon: '✅', label: 'On Track' },
  passed: { bar: 'bg-gray-400',   badge: 'bg-gray-50 border-gray-200',   text: 'text-gray-500',   icon: '⏰', label: 'Passed' },
}

export function DeadlineTracker({ deadlines, compact = false }: DeadlineTrackerProps) {
  const sorted = [...deadlines].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (sorted.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">
        No deadlines set for this case.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sorted.map((deadline) => {
        const { days, hours, level } = getUrgency(deadline.date)
        const style = URGENCY_STYLES[level]
        const d = new Date(deadline.date)

        return (
          <div
            key={deadline.id}
            className={`rounded-lg border p-3 ${style.badge} transition-all`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 min-w-0">
                <span className="text-lg flex-shrink-0">{style.icon}</span>
                <div className="min-w-0">
                  <p className={`font-medium text-sm ${style.text}`}>{deadline.label}</p>
                  {deadline.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{deadline.description}</p>
                  )}
                  {!compact && (
                    <p className="text-xs text-gray-400 mt-1">
                      {d.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                {level === 'passed' ? (
                  <span className="text-xs font-medium text-gray-500">Passed</span>
                ) : (
                  <div>
                    <p className={`text-lg font-bold ${style.text} leading-none`}>{days}d</p>
                    {hours > 0 && days < 3 && (
                      <p className={`text-xs ${style.text}`}>{hours}h left</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Progress bar */}
            {level !== 'passed' && (
              <div className="mt-2 h-1 bg-white/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${style.bar} transition-all`}
                  style={{ width: `${Math.min(100, Math.max(5, level === 'green' ? 10 : level === 'yellow' ? 40 : level === 'orange' ? 70 : 90))}%` }}
                />
              </div>
            )}
          </div>
        )
      })}

      {/* Philippine Reglementary Reference */}
      {!compact && (
        <div className="mt-6 p-4 bg-navy-50 border border-navy-100 rounded-lg">
          <h4 className="text-xs font-semibold text-navy-700 uppercase tracking-wider mb-3">
            🏛️ Philippine Reglementary Reference
          </h4>
          <div className="space-y-1.5">
            {Object.entries(REGLEMENTARY_PERIODS).slice(0, 6).map(([key, period]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-gray-600">{period.label}</span>
                <span className="font-medium text-navy-700">{period.days} days</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Per Rules of Court (Philippines)</p>
        </div>
      )}
    </div>
  )
}

// Utility: build deadlines array from a case object
export function buildCaseDeadlines(caseData: {
  id: string
  reglementaryDeadline?: Date | string | null
  prescriptionDate?: Date | string | null
  nextHearingDate?: Date | string | null
  dateOfFiling?: Date | string | null
}): Deadline[] {
  const deadlines: Deadline[] = []

  if (caseData.reglementaryDeadline) {
    deadlines.push({
      id: `${caseData.id}-reglementary`,
      label: 'Reglementary Deadline',
      date: caseData.reglementaryDeadline,
      type: 'reglementary',
      description: 'Court-prescribed period for procedural compliance',
    })
  }

  if (caseData.prescriptionDate) {
    deadlines.push({
      id: `${caseData.id}-prescription`,
      label: 'Prescription Date',
      date: caseData.prescriptionDate,
      type: 'prescription',
      description: 'Statute of limitations deadline',
    })
  }

  if (caseData.nextHearingDate) {
    deadlines.push({
      id: `${caseData.id}-hearing`,
      label: 'Next Hearing',
      date: caseData.nextHearingDate,
      type: 'hearing',
      description: 'Scheduled court hearing',
    })
  }

  return deadlines
}
