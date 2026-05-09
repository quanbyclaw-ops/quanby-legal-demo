'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { CaseType } from '@/types'

interface LawyerData {
  id: string
  firstName: string
  lastName: string
  barNumber?: string | null
  specializations: string[]
  avatarUrl?: string | null
  _count?: { assignedCases: number }
  maxCaseLoad?: number | null
}

interface LawyerAssignmentProps {
  caseId: string
  caseType: CaseType
  currentLawyerId?: string | null
  lawyers: LawyerData[]
  onAssigned?: (lawyerId: string, lawyer: LawyerData) => void
}

// Specialization matching: maps case types to relevant specializations
const CASE_TYPE_SPECIALIZATIONS: Record<string, string[]> = {
  CIVIL:              ['Civil Law', 'Property Law', 'Torts', 'Contracts'],
  CRIMINAL:           ['Criminal Law', 'Criminal Defense', 'Penal Law'],
  LABOR:              ['Labor Law', 'Employment Law', 'NLRC'],
  ADMINISTRATIVE:     ['Administrative Law', 'Government Law', 'Public Law'],
  FAMILY:             ['Family Law', 'Domestic Relations', 'Child Custody'],
  COMMERCIAL:         ['Commercial Law', 'Corporate Law', 'Business Law'],
  SPECIAL_PROCEEDINGS:['Civil Law', 'Special Proceedings', 'Estate Law'],
  ELECTION:           ['Election Law', 'COMELEC', 'Political Law'],
  TAX:                ['Tax Law', 'Taxation', 'CTA', 'BIR'],
  ENVIRONMENTAL:      ['Environmental Law', 'Natural Resources', 'Green Law'],
}

function computeMatchScore(lawyer: LawyerData, caseType: CaseType): number {
  const relevantSpecs = CASE_TYPE_SPECIALIZATIONS[caseType] ?? []
  const lawyerSpecs = lawyer.specializations.map((s) => s.toLowerCase())
  const matchCount = relevantSpecs.filter((s) => lawyerSpecs.some((ls) => ls.includes(s.toLowerCase()))).length
  return matchCount
}

function getWorkloadColor(utilization: number): string {
  if (utilization >= 90) return 'bg-red-500'
  if (utilization >= 70) return 'bg-orange-500'
  if (utilization >= 40) return 'bg-yellow-500'
  return 'bg-green-500'
}

function getWorkloadLabel(utilization: number): string {
  if (utilization >= 90) return 'Overloaded'
  if (utilization >= 70) return 'High'
  if (utilization >= 40) return 'Moderate'
  return 'Available'
}

export function LawyerAssignment({
  caseId,
  caseType,
  currentLawyerId,
  lawyers,
  onAssigned,
}: LawyerAssignmentProps) {
  const [selectedId, setSelectedId] = useState<string | null>(currentLawyerId ?? null)
  const [isAssigning, setIsAssigning] = useState(false)
  const [suggestHighlight, setSuggestHighlight] = useState(false)

  // Score and sort lawyers
  const scoredLawyers = lawyers.map((l) => {
    const activeCases = l._count?.assignedCases ?? 0
    const maxLoad = l.maxCaseLoad ?? 20
    const utilization = Math.min(100, Math.round((activeCases / maxLoad) * 100))
    const matchScore = computeMatchScore(l, caseType)
    return { ...l, activeCases, maxLoad, utilization, matchScore }
  })

  const bestMatch = scoredLawyers
    .filter((l) => l.utilization < 90)
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore
      return a.utilization - b.utilization
    })[0]

  const handleSuggest = () => {
    if (bestMatch) {
      setSelectedId(bestMatch.id)
      setSuggestHighlight(true)
      setTimeout(() => setSuggestHighlight(false), 2000)
    }
  }

  const handleAssign = async () => {
    if (!selectedId) return
    setIsAssigning(true)
    try {
      const res = await fetch(`/api/cases/${caseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedLawyerId: selectedId }),
      })
      const json = await res.json()
      if (json.success) {
        const lawyer = lawyers.find((l) => l.id === selectedId)
        if (lawyer) onAssigned?.(selectedId, lawyer)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsAssigning(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Assign Lawyer</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={handleSuggest}
          className="border-navy-200 text-navy-700 hover:bg-navy-50 text-xs"
        >
          ✨ Suggest Best Match
        </Button>
      </div>

      {lawyers.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No lawyers available.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {scoredLawyers.map((lawyer) => {
            const isSelected = selectedId === lawyer.id
            const isCurrent = currentLawyerId === lawyer.id
            const isBest = bestMatch?.id === lawyer.id
            const wColor = getWorkloadColor(lawyer.utilization)
            const wLabel = getWorkloadLabel(lawyer.utilization)

            return (
              <div
                key={lawyer.id}
                onClick={() => setSelectedId(lawyer.id)}
                className={`cursor-pointer rounded-lg border p-3 transition-all ${
                  isSelected
                    ? suggestHighlight && isBest
                      ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-300'
                      : 'border-navy-400 bg-navy-50'
                    : 'border-gray-100 bg-white hover:border-navy-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 font-bold text-sm flex-shrink-0">
                    {lawyer.firstName[0]}{lawyer.lastName[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm text-gray-900">
                        Atty. {lawyer.firstName} {lawyer.lastName}
                      </p>
                      {isBest && (
                        <span className="text-xs bg-blue-100 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-full font-medium">
                          Best Match
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-xs bg-green-100 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    {lawyer.barNumber && (
                      <p className="text-xs text-gray-400">Bar No. {lawyer.barNumber}</p>
                    )}
                    {lawyer.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lawyer.specializations.slice(0, 3).map((spec) => (
                          <span
                            key={spec}
                            className={`text-xs px-1.5 py-0.5 rounded-full ${
                              (CASE_TYPE_SPECIALIZATIONS[caseType] ?? []).some((s) =>
                                spec.toLowerCase().includes(s.toLowerCase())
                              )
                                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Workload bar */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-gray-400">
                          {lawyer.activeCases}/{lawyer.maxLoad} cases
                        </span>
                        <span className={`text-xs font-medium ${
                          lawyer.utilization >= 90 ? 'text-red-600' :
                          lawyer.utilization >= 70 ? 'text-orange-600' :
                          lawyer.utilization >= 40 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {wLabel} ({lawyer.utilization}%)
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${wColor}`}
                          style={{ width: `${lawyer.utilization}%` }}
                        />
                      </div>
                    </div>

                    {/* Match score */}
                    {lawyer.matchScore > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-xs text-gray-400">Specialization match:</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-sm ${
                                i < lawyer.matchScore ? 'bg-blue-400' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Radio indicator */}
                  <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-navy-500 bg-navy-500' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Button
        onClick={handleAssign}
        disabled={!selectedId || selectedId === currentLawyerId || isAssigning}
        className="w-full bg-navy-950 hover:bg-navy-800 text-white"
      >
        {isAssigning
          ? 'Assigning...'
          : selectedId === currentLawyerId
          ? 'Already Assigned'
          : 'Assign Lawyer'}
      </Button>
    </div>
  )
}
