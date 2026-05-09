'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { CaseTimeline } from '@/components/cases/CaseTimeline'
import { TaskList } from '@/components/cases/TaskList'
import { DeadlineTracker, buildCaseDeadlines } from '@/components/cases/DeadlineTracker'
import { LawyerAssignment } from '@/components/cases/LawyerAssignment'
import { CASE_TYPES, CASE_STATUSES, CASE_PRIORITIES, COURT_LEVELS } from '@/lib/constants'
import type { CaseType, CasePriority, CaseStatus } from '@/types'

const STATUS_BADGE: Record<string, string> = {
  INTAKE:            'bg-gray-100 text-gray-700 border-gray-200',
  SCREENING:         'bg-yellow-100 text-yellow-700 border-yellow-200',
  PENDING_ASSIGNMENT:'bg-yellow-100 text-yellow-800 border-yellow-200',
  ASSIGNED:          'bg-blue-100 text-blue-700 border-blue-200',
  ACTIVE:            'bg-green-100 text-green-700 border-green-200',
  ON_HOLD:           'bg-orange-100 text-orange-700 border-orange-200',
  HEARING:           'bg-purple-100 text-purple-700 border-purple-200',
  AWAITING_HEARING:  'bg-purple-100 text-purple-700 border-purple-200',
  SUBMITTED:         'bg-indigo-100 text-indigo-700 border-indigo-200',
  AWAITING_DECISION: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  DECIDED:           'bg-teal-100 text-teal-700 border-teal-200',
  APPEALED:          'bg-orange-100 text-orange-800 border-orange-200',
  CLOSED_WON:        'bg-emerald-100 text-emerald-700 border-emerald-200',
  CLOSED_LOST:       'bg-red-100 text-red-700 border-red-200',
  CLOSED_SETTLED:    'bg-teal-100 text-teal-700 border-teal-200',
  DISMISSED:         'bg-gray-100 text-gray-600 border-gray-200',
  ARCHIVED:          'bg-gray-100 text-gray-500 border-gray-200',
}

const PRIORITY_BADGE: Record<string, string> = {
  URGENT: 'bg-red-100 text-red-700 border-red-200',
  HIGH:   'bg-orange-100 text-orange-700 border-orange-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  LOW:    'bg-green-100 text-green-700 border-green-200',
}

const RISK_BADGE: Record<string, string> = {
  LOW:      'bg-green-100 text-green-700',
  MEDIUM:   'bg-yellow-100 text-yellow-700',
  HIGH:     'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-red-100 text-red-700',
}

const DOC_TYPE_BADGE: Record<string, string> = {
  COMPLAINT: 'bg-red-50 text-red-700',
  ANSWER:    'bg-blue-50 text-blue-700',
  MOTION:    'bg-purple-50 text-purple-700',
  ORDER:     'bg-navy-50 text-navy-700',
  DECISION:  'bg-teal-50 text-teal-700',
  AFFIDAVIT: 'bg-orange-50 text-orange-700',
  CONTRACT:  'bg-green-50 text-green-700',
  GENERATED_DRAFT: 'bg-indigo-50 text-indigo-700',
  OTHER:     'bg-gray-50 text-gray-700',
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex gap-3 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 w-36 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-800 font-medium">{value ?? '—'}</span>
    </div>
  )
}

interface CaseDetailClientProps {
  initialCase: any
  lawyers: any[]
  currentUser: any
}

export function CaseDetailClient({ initialCase, lawyers, currentUser }: CaseDetailClientProps) {
  const [caseData, setCaseData] = useState(initialCase)
  const [activeTab, setActiveTab] = useState('overview')
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState(caseData.status)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async () => {
    if (!newStatus || newStatus === caseData.status) return
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/cases/${caseData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const json = await res.json()
      if (json.success) {
        setCaseData({ ...caseData, status: newStatus })
        setIsStatusDialogOpen(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleLawyerAssigned = (lawyerId: string, lawyer: any) => {
    setCaseData({ ...caseData, assignedLawyerId: lawyerId, assignedLawyer: lawyer })
    setIsAssignDialogOpen(false)
  }

  const deadlines = buildCaseDeadlines(caseData)
  const typeConfig = CASE_TYPES[caseData.type as CaseType]
  const statusLabel = CASE_STATUSES[caseData.status as keyof typeof CASE_STATUSES]?.label ?? caseData.status
  const statusClass = STATUS_BADGE[caseData.status] ?? 'bg-gray-100 text-gray-700 border-gray-200'
  const priorityConfig = CASE_PRIORITIES[caseData.priority as CasePriority]
  const priorityClass = PRIORITY_BADGE[caseData.priority] ?? 'bg-gray-100 text-gray-700 border-gray-200'
  const courtLevel = caseData.courtLevel ? COURT_LEVELS[caseData.courtLevel as keyof typeof COURT_LEVELS]?.label : null

  const reglDeadlineDays = caseData.reglementaryDeadline
    ? Math.ceil((new Date(caseData.reglementaryDeadline).getTime() - Date.now()) / 86400000)
    : null

  const ALL_STATUSES = Object.entries(CASE_STATUSES).map(([k, v]) => ({ value: k, label: v.label }))

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400">
        <Link href="/dashboard" className="hover:text-navy-700">Dashboard</Link>
        <span className="mx-1.5">/</span>
        <Link href="/cases" className="hover:text-navy-700">Cases</Link>
        <span className="mx-1.5">/</span>
        <span className="text-navy-700 font-medium">{caseData.caseNumber}</span>
      </nav>

      {/* Case Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-mono text-sm text-navy-500 font-semibold">{caseData.caseNumber}</span>
              <Badge className={`text-xs border ${statusClass}`}>{statusLabel}</Badge>
              <Badge className={`text-xs border ${priorityClass}`}>{priorityConfig?.label ?? caseData.priority}</Badge>
              <Badge className="text-xs bg-blue-50 text-blue-700 border border-blue-100">
                {typeConfig?.label ?? caseData.type}
              </Badge>
              {caseData.isConfidential && (
                <Badge className="text-xs bg-red-50 text-red-700 border border-red-100">🔒 Confidential</Badge>
              )}
            </div>
            <h1 className="text-xl font-bold text-navy-950 leading-tight">{caseData.title}</h1>
            {caseData.courtName && (
              <p className="text-sm text-gray-500 mt-1">
                {courtLevel && <span>{courtLevel} · </span>}
                {caseData.courtName}
                {caseData.courtBranch && `, Branch ${caseData.courtBranch}`}
                {caseData.courtDocket && <span className="font-mono ml-1 text-navy-500"> [{caseData.courtDocket}]</span>}
              </p>
            )}
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-4 text-sm flex-shrink-0">
            <div className="text-center">
              <p className="text-lg font-bold text-navy-950">{caseData._count?.documents ?? 0}</p>
              <p className="text-xs text-gray-400">Docs</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-navy-950">{caseData._count?.tasks ?? 0}</p>
              <p className="text-xs text-gray-400">Tasks</p>
            </div>
            <div className="text-center">
              <p className={`text-lg font-bold ${reglDeadlineDays !== null && reglDeadlineDays <= 7 ? 'text-red-600' : 'text-navy-950'}`}>
                {reglDeadlineDays !== null ? `${reglDeadlineDays}d` : '—'}
              </p>
              <p className="text-xs text-gray-400">Deadline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Tabs */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white border border-gray-100 rounded-xl p-1 h-auto flex-wrap">
              {[
                { value: 'overview',   label: '📋 Overview' },
                { value: 'timeline',   label: `🕐 Timeline (${caseData._count?.timeline ?? 0})` },
                { value: 'tasks',      label: `✅ Tasks (${caseData._count?.tasks ?? 0})` },
                { value: 'documents',  label: `📄 Documents (${caseData._count?.documents ?? 0})` },
                { value: 'contracts',  label: `📑 Contracts (${caseData._count?.contracts ?? 0})` },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-xs font-medium px-3 py-1.5 data-[state=active]:bg-navy-950 data-[state=active]:text-white rounded-lg"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-5 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Client Info */}
                <Card className="border-gray-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-700">👤 Client</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <InfoRow label="Full Name" value={`${caseData.client?.user?.firstName} ${caseData.client?.user?.lastName}`} />
                    <InfoRow label="Email" value={caseData.client?.user?.email} />
                    {caseData.client?.user?.phone && <InfoRow label="Phone" value={caseData.client.user.phone} />}
                    {caseData.client?.municipality && (
                      <InfoRow label="Address" value={`${caseData.client.barangay ?? ''}, ${caseData.client.municipality}, ${caseData.client.province ?? ''}`} />
                    )}
                    {caseData.client?.occupation && <InfoRow label="Occupation" value={caseData.client.occupation} />}
                  </CardContent>
                </Card>

                {/* Case Details */}
                <Card className="border-gray-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-700">⚖️ Case Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <InfoRow label="Case Type" value={typeConfig?.label ?? caseData.type} />
                    <InfoRow label="Court Level" value={courtLevel ?? undefined} />
                    {caseData.judgeAssigned && <InfoRow label="Judge" value={caseData.judgeAssigned} />}
                    {caseData.opposingParty && <InfoRow label="Opposing Party" value={caseData.opposingParty} />}
                    {caseData.opposingCounsel && <InfoRow label="Opposing Counsel" value={caseData.opposingCounsel} />}
                    {caseData.causeOfAction && <InfoRow label="Cause of Action" value={caseData.causeOfAction} />}
                  </CardContent>
                </Card>
              </div>

              {/* Key Dates */}
              <Card className="border-gray-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-700">📅 Key Dates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { label: 'Date of Incident', date: caseData.dateOfIncident },
                      { label: 'Date of Filing', date: caseData.dateOfFiling },
                      { label: 'Prescription Date', date: caseData.prescriptionDate },
                      { label: 'Next Hearing', date: caseData.nextHearingDate },
                      { label: 'Reglementary Deadline', date: caseData.reglementaryDeadline },
                      { label: 'Case Created', date: caseData.createdAt },
                    ].map(({ label, date }) => (
                      <div key={label} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                        <p className={`text-sm font-semibold ${
                          label === 'Reglementary Deadline' && reglDeadlineDays !== null && reglDeadlineDays <= 7
                            ? 'text-red-600'
                            : 'text-navy-950'
                        }`}>
                          {date ? new Date(date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </p>
                        {label === 'Reglementary Deadline' && reglDeadlineDays !== null && (
                          <p className={`text-xs mt-0.5 font-medium ${
                            reglDeadlineDays <= 3 ? 'text-red-500' :
                            reglDeadlineDays <= 7 ? 'text-orange-500' : 'text-green-600'
                          }`}>
                            {reglDeadlineDays <= 0 ? `${Math.abs(reglDeadlineDays)}d overdue` : `${reglDeadlineDays} days left`}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Assigned Lawyer */}
              <Card className="border-gray-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-700">👨‍⚖️ Assigned Lawyer</CardTitle>
                </CardHeader>
                <CardContent>
                  {caseData.assignedLawyer ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 font-bold">
                        {caseData.assignedLawyer.firstName[0]}{caseData.assignedLawyer.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-navy-950">
                          Atty. {caseData.assignedLawyer.firstName} {caseData.assignedLawyer.lastName}
                        </p>
                        {caseData.assignedLawyer.barNumber && (
                          <p className="text-xs text-gray-500">Bar No. {caseData.assignedLawyer.barNumber}</p>
                        )}
                        {caseData.assignedLawyer.email && (
                          <p className="text-xs text-gray-400">{caseData.assignedLawyer.email}</p>
                        )}
                        {caseData.assignedLawyer.specializations?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {caseData.assignedLawyer.specializations.slice(0, 3).map((s: string) => (
                              <span key={s} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">👤</div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">No lawyer assigned</p>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-blue-600 text-xs"
                          onClick={() => setIsAssignDialogOpen(true)}
                        >
                          Assign a lawyer →
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Description */}
              {(caseData.description || caseData.reliefSought || caseData.factualBackground) && (
                <Card className="border-gray-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-700">📝 Case Description</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {caseData.description && (
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Description</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{caseData.description}</p>
                      </div>
                    )}
                    {caseData.reliefSought && (
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Relief Sought</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{caseData.reliefSought}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="mt-4">
              <Card className="border-gray-100">
                <CardContent className="pt-5">
                  <CaseTimeline
                    caseId={caseData.id}
                    events={caseData.timeline ?? []}
                    onEventAdded={(event) => {
                      setCaseData((prev: any) => ({
                        ...prev,
                        timeline: [event, ...prev.timeline],
                        _count: { ...prev._count, timeline: (prev._count?.timeline ?? 0) + 1 },
                      }))
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="mt-4">
              <Card className="border-gray-100">
                <CardContent className="pt-5">
                  <TaskList
                    caseId={caseData.id}
                    tasks={caseData.tasks ?? []}
                    onTasksChanged={(tasks) => {
                      setCaseData((prev: any) => ({
                        ...prev,
                        tasks,
                        _count: { ...prev._count, tasks: tasks.length },
                      }))
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="mt-4">
              <Card className="border-gray-100">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-gray-700">Case Documents</CardTitle>
                  <Button size="sm" className="bg-navy-950 hover:bg-navy-800 text-white h-8 text-xs">
                    + Upload Document
                  </Button>
                </CardHeader>
                <CardContent>
                  {(!caseData.documents || caseData.documents.length === 0) ? (
                    <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-lg">
                      <div className="text-3xl mb-2">📁</div>
                      <p className="text-sm">No documents uploaded yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {caseData.documents.map((doc: any) => (
                        <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-navy-200 hover:bg-gray-50 transition-all">
                          <span className="text-xl flex-shrink-0">📄</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">{doc.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-xs px-1.5 py-0.5 rounded-full ${DOC_TYPE_BADGE[doc.type] ?? 'bg-gray-50 text-gray-700'}`}>
                                {doc.type.replace(/_/g, ' ')}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(doc.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              {doc.isNotarized && (
                                <span className="text-xs bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded-full">✓ Notarized</span>
                              )}
                            </div>
                          </div>
                          {doc.storageUrl && (
                            <a
                              href={doc.storageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Download ↓
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contracts Tab */}
            <TabsContent value="contracts" className="mt-4">
              <Card className="border-gray-100">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-gray-700">Linked Contracts</CardTitle>
                  <Link href="/contracts/upload">
                    <Button size="sm" className="bg-navy-950 hover:bg-navy-800 text-white h-8 text-xs">
                      + Link Contract
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {(!caseData.contracts || caseData.contracts.length === 0) ? (
                    <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-lg">
                      <div className="text-3xl mb-2">📑</div>
                      <p className="text-sm">No contracts linked to this case.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {caseData.contracts.map((contract: any) => {
                        const latestAnalysis = contract.analyses?.[0]
                        return (
                          <div key={contract.id} className="p-4 rounded-lg border border-gray-100 hover:border-navy-200 transition-all">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Link href={`/contracts/${contract.id}`} className="font-medium text-sm text-navy-700 hover:text-blue-600 truncate">
                                    {contract.title}
                                  </Link>
                                  <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                                    {contract.type.replace(/_/g, ' ')}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {contract.partyA} ↔ {contract.partyB}
                                </p>
                                {contract.expirationDate && (
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    Expires: {new Date(contract.expirationDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </p>
                                )}
                              </div>
                              <div className="flex-shrink-0 text-right">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  contract.status === 'EXECUTED' ? 'bg-green-100 text-green-700' :
                                  contract.status === 'ANALYZING' ? 'bg-yellow-100 text-yellow-700' :
                                  contract.status === 'ANALYZED' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {contract.status.replace(/_/g, ' ')}
                                </span>
                                {latestAnalysis?.riskLevel && (
                                  <div className={`text-xs mt-1 px-1.5 py-0.5 rounded-full ${RISK_BADGE[latestAnalysis.riskLevel] ?? 'bg-gray-100 text-gray-700'}`}>
                                    {latestAnalysis.riskLevel} Risk
                                    {latestAnalysis.overallRiskScore && ` (${latestAnalysis.overallRiskScore})`}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar: Quick Actions + Deadlines */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <Card className="border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">⚡ Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-gray-200 text-navy-700 hover:bg-navy-50 text-xs h-9"
                onClick={() => setIsStatusDialogOpen(true)}
              >
                🔄 Change Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-gray-200 text-navy-700 hover:bg-navy-50 text-xs h-9"
                onClick={() => setIsAssignDialogOpen(true)}
              >
                👨‍⚖️ Assign Lawyer
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-gray-200 text-navy-700 hover:bg-navy-50 text-xs h-9"
                onClick={() => setActiveTab('tasks')}
              >
                ➕ Add Deadline / Task
              </Button>
              <Link href="/documents">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-gray-200 text-navy-700 hover:bg-navy-50 text-xs h-9"
                >
                  📝 Generate Document
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Deadline Tracker */}
          <Card className="border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">⏰ Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <DeadlineTracker deadlines={deadlines} compact />
            </CardContent>
          </Card>

          {/* Case meta */}
          <Card className="border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">📌 Case Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <InfoRow label="Created" value={new Date(caseData.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })} />
              <InfoRow label="Updated" value={new Date(caseData.updatedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })} />
              <InfoRow label="Created By" value={caseData.createdBy ? `${caseData.createdBy.firstName} ${caseData.createdBy.lastName}` : undefined} />
              {caseData.estimatedValue && (
                <InfoRow label="Est. Value" value={`PHP ${Number(caseData.estimatedValue).toLocaleString('en-PH')}`} />
              )}
              {caseData.tags?.length > 0 && (
                <div className="flex gap-1 flex-wrap pt-1">
                  {caseData.tags.map((tag: string) => (
                    <span key={tag} className="text-xs bg-navy-50 text-navy-600 px-1.5 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Change Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-navy-950">Change Case Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-gray-500">Current: <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${statusClass}`}>{statusLabel}</span></p>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm bg-white"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleStatusChange}
              disabled={!newStatus || newStatus === caseData.status || isUpdating}
              className="bg-navy-950 hover:bg-navy-800 text-white"
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Lawyer Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy-950">Assign Lawyer</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <LawyerAssignment
              caseId={caseData.id}
              caseType={caseData.type}
              currentLawyerId={caseData.assignedLawyerId}
              lawyers={lawyers}
              onAssigned={handleLawyerAssigned}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
