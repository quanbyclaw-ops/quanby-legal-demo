'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CASE_TYPES, CASE_PRIORITIES, COURT_LEVELS } from '@/lib/constants'
import {
  Scale,
  User,
  Gavel,
  Calendar,
  Tag,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react'
import { toast } from 'sonner'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ClientOption {
  id: string
  user: { firstName: string; lastName: string; email: string }
}

interface LawyerOption {
  id: string
  firstName: string
  lastName: string
  barNumber?: string | null
}

interface FormState {
  title: string
  type: string
  priority: string
  clientId: string
  assignedLawyerId: string
  description: string
  causeOfAction: string
  reliefSought: string
  courtLevel: string
  courtName: string
  courtBranch: string
  courtDocket: string
  judgeAssigned: string
  dateOfIncident: string
  reglementaryDeadline: string
  opposingParty: string
  opposingCounsel: string
  estimatedValue: string
  isConfidential: boolean
  tags: string
}

type FormErrors = Record<string, string>

// ─── Field helpers ──────────────────────────────────────────────────────────────

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
      <AlertTriangle className="h-3 w-3" />
      {message}
    </p>
  )
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex items-start gap-3 mb-4 pb-3 border-b border-gray-100">
      <div className="rounded-lg bg-blue-50 p-2">
        <Icon className="h-4 w-4 text-blue-600" />
      </div>
      <div>
        <p className="font-semibold text-slate-900 text-sm">{title}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function NewCasePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [clients, setClients] = useState<ClientOption[]>([])
  const [lawyers, setLawyers] = useState<LawyerOption[]>([])
  const [loadingClients, setLoadingClients] = useState(true)

  const [form, setForm] = useState<FormState>({
    title: '',
    type: '',
    priority: 'MEDIUM',
    clientId: '',
    assignedLawyerId: '',
    description: '',
    causeOfAction: '',
    reliefSought: '',
    courtLevel: '',
    courtName: '',
    courtBranch: '',
    courtDocket: '',
    judgeAssigned: '',
    dateOfIncident: '',
    reglementaryDeadline: '',
    opposingParty: '',
    opposingCounsel: '',
    estimatedValue: '',
    isConfidential: false,
    tags: '',
  })

  // Load clients and lawyers
  useEffect(() => {
    async function load() {
      setLoadingClients(true)
      try {
        const [cRes, lRes] = await Promise.all([
          fetch('/api/clients?pageSize=100'),
          fetch('/api/users?role=LAWYER&pageSize=50'),
        ])
        if (cRes.ok) {
          const cj = await cRes.json()
          setClients(cj.data ?? [])
        }
        if (lRes.ok) {
          const lj = await lRes.json()
          setLawyers(lj.data ?? [])
        }
      } catch {
        // Silently handle — dropdowns just stay empty
      } finally {
        setLoadingClients(false)
      }
    }
    load()
  }, [])

  function setField(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e })
  }

  function validate(): boolean {
    const e: FormErrors = {}
    if (!form.title.trim()) e.title = 'Case title is required.'
    if (!form.type) e.type = 'Case type is required.'
    if (!form.clientId) e.clientId = 'Please select a client.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const tags = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        title: form.title,
        type: form.type,
        priority: form.priority,
        clientId: form.clientId,
        assignedLawyerId: form.assignedLawyerId || undefined,
        description: form.description || undefined,
        causeOfAction: form.causeOfAction || undefined,
        reliefSought: form.reliefSought || undefined,
        courtLevel: form.courtLevel || undefined,
        courtName: form.courtName || undefined,
        courtBranch: form.courtBranch || undefined,
        courtDocket: form.courtDocket || undefined,
        judgeAssigned: form.judgeAssigned || undefined,
        dateOfIncident: form.dateOfIncident || undefined,
        reglementaryDeadline: form.reglementaryDeadline || undefined,
        opposingParty: form.opposingParty || undefined,
        opposingCounsel: form.opposingCounsel || undefined,
        estimatedValue: form.estimatedValue ? parseFloat(form.estimatedValue) : undefined,
        isConfidential: form.isConfidential,
        tags,
      }

      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (json.success) {
        toast.success('Case created successfully', {
          description: `${json.data.caseNumber} has been opened and is ready for assignment.`,
        })
        router.push(`/cases/${json.data.id}`)
      } else {
        setSubmitError(json.error?.message ?? 'Failed to create case.')
        toast.error('Failed to create case', { description: json.error?.message })
      }
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Encode New Case</h1>
          <p className="text-sm text-gray-500 mt-1">
            Register a new case with full classification and court information
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <Link href="/dashboard" className="hover:text-navy-950">Dashboard</Link>
        <span className="mx-2">/</span>
        <Link href="/cases" className="hover:text-navy-950">Cases</Link>
        <span className="mx-2">/</span>
        <span className="text-navy-950 font-medium">New Case</span>
      </nav>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-slate-900">Case Information</CardTitle>
            <CardDescription>Core classification and description.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SectionHeading icon={Scale} title="Classification" />
            <div>
              <FieldLabel required>Case Title</FieldLabel>
              <Input
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="e.g. Dela Cruz vs. Santos – Estafa"
                className={errors.title ? 'border-red-400' : ''}
              />
              <FieldError message={errors.title} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FieldLabel required>Case Type</FieldLabel>
                <Select value={form.type} onValueChange={(v) => setField('type', v)}>
                  <SelectTrigger className={errors.type ? 'border-red-400' : ''}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CASE_TYPES).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.type} />
              </div>
              <div>
                <FieldLabel>Priority</FieldLabel>
                <Select value={form.priority} onValueChange={(v) => setField('priority', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CASE_PRIORITIES).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end pb-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isConfidential}
                    onChange={(e) => setField('isConfidential', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-sm text-slate-700">Mark as Confidential</span>
                </label>
              </div>
            </div>

            <div>
              <FieldLabel>Case Description / Background</FieldLabel>
              <Textarea
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                placeholder="Factual background and summary of the legal dispute..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Cause of Action</FieldLabel>
                <Input
                  value={form.causeOfAction}
                  onChange={(e) => setField('causeOfAction', e.target.value)}
                  placeholder="e.g. Breach of Contract, Estafa"
                />
              </div>
              <div>
                <FieldLabel>Relief Sought</FieldLabel>
                <Input
                  value={form.reliefSought}
                  onChange={(e) => setField('reliefSought', e.target.value)}
                  placeholder="e.g. Payment of ₱500,000 in damages"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client & Lawyer */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <SectionHeading icon={User} title="Parties" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel required>Client</FieldLabel>
                <Select
                  value={form.clientId}
                  onValueChange={(v) => setField('clientId', v)}
                  disabled={loadingClients}
                >
                  <SelectTrigger className={errors.clientId ? 'border-red-400' : ''}>
                    <SelectValue placeholder={loadingClients ? 'Loading clients…' : 'Select client'} />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.user.firstName} {c.user.lastName} — {c.user.email}
                      </SelectItem>
                    ))}
                    {clients.length === 0 && !loadingClients && (
                      <SelectItem value="__none" disabled>No clients found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FieldError message={errors.clientId} />
                <p className="text-xs text-slate-400 mt-1">
                  To register a new client,{' '}
                  <Link href="/intake" className="text-blue-600 hover:underline">use the Intake form</Link>.
                </p>
              </div>
              <div>
                <FieldLabel>Assigned Lawyer</FieldLabel>
                <Select
                  value={form.assignedLawyerId}
                  onValueChange={(v) => setField('assignedLawyerId', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Assign later" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {lawyers.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        Atty. {l.firstName} {l.lastName}
                        {l.barNumber ? ` (Roll #${l.barNumber})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FieldLabel>Opposing Party</FieldLabel>
                <Input
                  value={form.opposingParty}
                  onChange={(e) => setField('opposingParty', e.target.value)}
                  placeholder="Name of opposing party"
                />
              </div>
              <div>
                <FieldLabel>Opposing Counsel</FieldLabel>
                <Input
                  value={form.opposingCounsel}
                  onChange={(e) => setField('opposingCounsel', e.target.value)}
                  placeholder="Opposing lawyer's name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Court Information */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <SectionHeading icon={Gavel} title="Court Information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Court Level</FieldLabel>
                <Select value={form.courtLevel} onValueChange={(v) => setField('courtLevel', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select court level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(COURT_LEVELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FieldLabel>Court Name</FieldLabel>
                <Input
                  value={form.courtName}
                  onChange={(e) => setField('courtName', e.target.value)}
                  placeholder="e.g. Regional Trial Court, Calamba City"
                />
              </div>
              <div>
                <FieldLabel>Branch / Division</FieldLabel>
                <Input
                  value={form.courtBranch}
                  onChange={(e) => setField('courtBranch', e.target.value)}
                  placeholder="e.g. Branch 35"
                />
              </div>
              <div>
                <FieldLabel>Court Docket No.</FieldLabel>
                <Input
                  value={form.courtDocket}
                  onChange={(e) => setField('courtDocket', e.target.value)}
                  placeholder="e.g. Crim. Case No. 2025-1234"
                />
              </div>
              <div>
                <FieldLabel>Judge Assigned</FieldLabel>
                <Input
                  value={form.judgeAssigned}
                  onChange={(e) => setField('judgeAssigned', e.target.value)}
                  placeholder="Honorable ..."
                />
              </div>
              <div>
                <FieldLabel>Estimated Case Value (PHP)</FieldLabel>
                <Input
                  type="number"
                  min={0}
                  value={form.estimatedValue}
                  onChange={(e) => setField('estimatedValue', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <SectionHeading icon={Calendar} title="Key Dates" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Date of Incident / Cause of Action</FieldLabel>
                <Input
                  type="date"
                  value={form.dateOfIncident}
                  onChange={(e) => setField('dateOfIncident', e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Reglementary Deadline</FieldLabel>
                <Input
                  type="date"
                  value={form.reglementaryDeadline}
                  onChange={(e) => setField('reglementaryDeadline', e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-1">
                  Critical filing deadline — will trigger deadline alerts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <SectionHeading icon={Tag} title="Tags / Categories" subtitle="Comma-separated tags for filtering" />
            <Input
              value={form.tags}
              onChange={(e) => setField('tags', e.target.value)}
              placeholder="e.g. urgent, land-dispute, pao-referred"
            />
            {form.tags && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.split(',').filter((t) => t.trim()).map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {submitError}
          </div>
        )}

        <div className="flex justify-between">
          <Button type="button" variant="outline" asChild>
            <Link href="/cases">
              <ArrowLeft className="h-4 w-4" />
              Back to Cases
            </Link>
          </Button>
          <Button type="submit" loading={isSubmitting} size="lg">
            <CheckCircle2 className="h-4 w-4" />
            Create Case
          </Button>
        </div>
      </form>
    </div>
  )
}
