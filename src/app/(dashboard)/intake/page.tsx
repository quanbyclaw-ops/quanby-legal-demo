'use client'

import { useState } from 'react'
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
import { IntakeWizard } from '@/components/cases/IntakeWizard'
import {
  EligibilityScreener,
  computeEligibility,
  createDefaultCriteria,
  type EligibilityCriterion,
} from '@/components/cases/EligibilityScreener'
import { ComplianceBadge } from '@/components/layout/ComplianceBadge'
import { CASE_TYPES, PH_REGIONS } from '@/lib/constants'
import {
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  FileText,
  Scale,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Edit2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PersonalInfo {
  firstName: string
  lastName: string
  middleName: string
  suffix: string
  dateOfBirth: string
  gender: string
  civilStatus: string
  nationality: string
  email: string
  phone: string
  alternatePhone: string
  streetAddress: string
  barangay: string
  municipality: string
  province: string
  region: string
  zipCode: string
  occupation: string
  employer: string
  monthlyIncome: string
}

interface CaseDetails {
  caseType: string
  caseDescription: string
  opposingParty: string
  courtPreference: string
  desiredOutcome: string
}

type FormErrors = Record<string, string>

// ─── Constants ─────────────────────────────────────────────────────────────────

const WIZARD_STEPS = [
  { id: 1, label: 'Personal Info', description: 'Client details' },
  { id: 2, label: 'Case Details', description: 'Legal concern' },
  { id: 3, label: 'Eligibility', description: 'Screening' },
  { id: 4, label: 'Review & Submit', description: 'Confirm' },
]

const CIVIL_STATUS_OPTIONS = [
  'Single',
  'Married',
  'Widowed',
  'Legally Separated',
  'Annulled',
  'Live-in',
]

const GENDER_OPTIONS = ['Male', 'Female', 'Prefer not to say', 'Other']

// ─── Field Components ──────────────────────────────────────────────────────────

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
    <div className="flex items-start gap-3 mb-5 pb-4 border-b border-gray-100">
      <div className="rounded-lg bg-blue-50 p-2">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

// ─── Review Row ────────────────────────────────────────────────────────────────

function ReviewRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex gap-2 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-slate-500 w-36 flex-shrink-0">{label}</span>
      <span className="text-xs text-slate-800 font-medium">{value}</span>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function IntakePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<{ caseNumber: string; caseId: string } | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const [personal, setPersonal] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    dateOfBirth: '',
    gender: '',
    civilStatus: '',
    nationality: 'Filipino',
    email: '',
    phone: '',
    alternatePhone: '',
    streetAddress: '',
    barangay: '',
    municipality: '',
    province: '',
    region: '',
    zipCode: '',
    occupation: '',
    employer: '',
    monthlyIncome: '',
  })

  const [caseDetails, setCaseDetails] = useState<CaseDetails>({
    caseType: '',
    caseDescription: '',
    opposingParty: '',
    courtPreference: '',
    desiredOutcome: '',
  })

  const [criteria, setCriteria] = useState<EligibilityCriterion[]>(createDefaultCriteria())

  // ─── Validation ──────────────────────────────────────────────────────────────

  function validateStep1(): boolean {
    const e: FormErrors = {}
    if (!personal.firstName.trim()) e.firstName = 'First name is required.'
    if (!personal.lastName.trim()) e.lastName = 'Last name is required.'
    if (!personal.email.trim()) e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email))
      e.email = 'Enter a valid email address.'
    if (!personal.phone.trim()) e.phone = 'Phone number is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep2(): boolean {
    const e: FormErrors = {}
    if (!caseDetails.caseType) e.caseType = 'Please select a case type.'
    if (!caseDetails.caseDescription.trim() || caseDetails.caseDescription.length < 10)
      e.caseDescription = 'Please provide at least a brief description (min. 10 characters).'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  function handleNext() {
    let valid = true
    if (step === 1) valid = validateStep1()
    if (step === 2) valid = validateStep2()
    if (valid) {
      setErrors({})
      setStep((s) => Math.min(s + 1, 4))
    }
  }

  function handleBack() {
    setErrors({})
    setStep((s) => Math.max(s - 1, 1))
  }

  // ─── Eligibility ─────────────────────────────────────────────────────────────

  function handleCriterionChange(id: string, status: 'pass' | 'fail' | 'warning') {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    )
  }

  // ─── Submit ───────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    setIsSubmitting(true)
    try {
      const eligibilityResult = computeEligibility(criteria)
      const eligibilityAnswers = Object.fromEntries(criteria.map((c) => [c.id, c.status]))

      const payload = {
        ...personal,
        monthlyIncome: personal.monthlyIncome ? parseFloat(personal.monthlyIncome) : undefined,
        ...caseDetails,
        eligibilityResult,
        eligibilityAnswers,
      }

      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (json.success) {
        setSubmitted({ caseNumber: json.data.caseNumber, caseId: json.data.caseId })
      } else {
        setErrors({ submit: json.error?.message ?? 'Submission failed. Please try again.' })
      }
    } catch {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Success State ────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto pt-8">
        <div className="bg-white rounded-2xl border border-emerald-200 p-10 text-center shadow-sm">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Intake Recorded</h2>
          <p className="text-slate-500 mb-1">
            Client intake has been successfully submitted and reviewed.
          </p>
          <p className="text-lg font-semibold text-blue-700 mb-8">
            Case #{submitted.caseNumber} created.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default" size="lg">
              <Link href={`/cases/${submitted.caseId}`}>
                <ExternalLink className="h-4 w-4" />
                View Case
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setSubmitted(null)
                setStep(1)
                setPersonal({
                  firstName: '', lastName: '', middleName: '', suffix: '',
                  dateOfBirth: '', gender: '', civilStatus: '', nationality: 'Filipino',
                  email: '', phone: '', alternatePhone: '',
                  streetAddress: '', barangay: '', municipality: '', province: '',
                  region: '', zipCode: '', occupation: '', employer: '', monthlyIncome: '',
                })
                setCaseDetails({ caseType: '', caseDescription: '', opposingParty: '', courtPreference: '', desiredOutcome: '' })
                setCriteria(createDefaultCriteria())
              }}
            >
              New Intake
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Client Intake & Eligibility Screening</h1>
          <p className="text-sm text-gray-500 mt-1">
            Register new clients and assess PAO / fee-based eligibility
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ComplianceBadge standard="RA-10173" variant="compact" />
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <Link href="/dashboard" className="hover:text-navy-950">Dashboard</Link>
        <span className="mx-2">/</span>
        <span className="text-navy-950 font-medium">Client Intake</span>
      </nav>

      {/* Wizard */}
      <IntakeWizard steps={WIZARD_STEPS} currentStep={step}>
        {/* ── STEP 1: Personal Info ── */}
        {step === 1 && (
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-slate-900">Step 1 of 4 — Personal Information</CardTitle>
              <CardDescription>Provide the client's personal and contact details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name Section */}
              <div>
                <SectionHeading icon={User} title="Full Name" subtitle="As it appears on government-issued ID" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>First Name</FieldLabel>
                    <Input
                      value={personal.firstName}
                      onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })}
                      placeholder="Juan"
                      className={errors.firstName ? 'border-red-400 focus-visible:ring-red-300' : ''}
                    />
                    <FieldError message={errors.firstName} />
                  </div>
                  <div>
                    <FieldLabel>Middle Name</FieldLabel>
                    <Input
                      value={personal.middleName}
                      onChange={(e) => setPersonal({ ...personal, middleName: e.target.value })}
                      placeholder="Santos"
                    />
                  </div>
                  <div>
                    <FieldLabel required>Last Name</FieldLabel>
                    <Input
                      value={personal.lastName}
                      onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })}
                      placeholder="dela Cruz"
                      className={errors.lastName ? 'border-red-400 focus-visible:ring-red-300' : ''}
                    />
                    <FieldError message={errors.lastName} />
                  </div>
                  <div>
                    <FieldLabel>Suffix</FieldLabel>
                    <Input
                      value={personal.suffix}
                      onChange={(e) => setPersonal({ ...personal, suffix: e.target.value })}
                      placeholder="Jr., III, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Demographics */}
              <div>
                <SectionHeading icon={User} title="Demographics" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <FieldLabel>Date of Birth</FieldLabel>
                    <Input
                      type="date"
                      value={personal.dateOfBirth}
                      onChange={(e) => setPersonal({ ...personal, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div>
                    <FieldLabel>Gender</FieldLabel>
                    <Select
                      value={personal.gender}
                      onValueChange={(v) => setPersonal({ ...personal, gender: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDER_OPTIONS.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <FieldLabel>Civil Status</FieldLabel>
                    <Select
                      value={personal.civilStatus}
                      onValueChange={(v) => setPersonal({ ...personal, civilStatus: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {CIVIL_STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <SectionHeading icon={Phone} title="Contact Information" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Email Address</FieldLabel>
                    <Input
                      type="email"
                      value={personal.email}
                      onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                      placeholder="juan@example.com"
                      className={errors.email ? 'border-red-400 focus-visible:ring-red-300' : ''}
                    />
                    <FieldError message={errors.email} />
                  </div>
                  <div>
                    <FieldLabel required>Mobile Number</FieldLabel>
                    <Input
                      value={personal.phone}
                      onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                      placeholder="+63 917 123 4567"
                      className={errors.phone ? 'border-red-400 focus-visible:ring-red-300' : ''}
                    />
                    <FieldError message={errors.phone} />
                  </div>
                  <div>
                    <FieldLabel>Alternate Phone</FieldLabel>
                    <Input
                      value={personal.alternatePhone}
                      onChange={(e) => setPersonal({ ...personal, alternatePhone: e.target.value })}
                      placeholder="(02) 8123 4567"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <SectionHeading icon={MapPin} title="Address" subtitle="Current residence or mailing address" />
                <div className="space-y-3">
                  <div>
                    <FieldLabel>Street Address / Unit / Bldg</FieldLabel>
                    <Input
                      value={personal.streetAddress}
                      onChange={(e) => setPersonal({ ...personal, streetAddress: e.target.value })}
                      placeholder="123 Rizal St., Unit 4B"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>Barangay</FieldLabel>
                      <Input
                        value={personal.barangay}
                        onChange={(e) => setPersonal({ ...personal, barangay: e.target.value })}
                        placeholder="Barangay name"
                      />
                    </div>
                    <div>
                      <FieldLabel>City / Municipality</FieldLabel>
                      <Input
                        value={personal.municipality}
                        onChange={(e) => setPersonal({ ...personal, municipality: e.target.value })}
                        placeholder="City or Municipality"
                      />
                    </div>
                    <div>
                      <FieldLabel>Province</FieldLabel>
                      <Input
                        value={personal.province}
                        onChange={(e) => setPersonal({ ...personal, province: e.target.value })}
                        placeholder="Province"
                      />
                    </div>
                    <div>
                      <FieldLabel>Region</FieldLabel>
                      <Select
                        value={personal.region}
                        onValueChange={(v) => setPersonal({ ...personal, region: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {PH_REGIONS.map((r) => (
                            <SelectItem key={r.code} value={r.code}>{r.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <FieldLabel>ZIP Code</FieldLabel>
                      <Input
                        value={personal.zipCode}
                        onChange={(e) => setPersonal({ ...personal, zipCode: e.target.value })}
                        placeholder="4 digits"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment & Income */}
              <div>
                <SectionHeading icon={Briefcase} title="Employment & Income" subtitle="Used for PAO/pro bono means test" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <FieldLabel>Occupation</FieldLabel>
                    <Input
                      value={personal.occupation}
                      onChange={(e) => setPersonal({ ...personal, occupation: e.target.value })}
                      placeholder="e.g. Tricycle driver"
                    />
                  </div>
                  <div>
                    <FieldLabel>Employer / Business Name</FieldLabel>
                    <Input
                      value={personal.employer}
                      onChange={(e) => setPersonal({ ...personal, employer: e.target.value })}
                      placeholder="Employer or self-employed"
                    />
                  </div>
                  <div>
                    <FieldLabel>Monthly Household Income (PHP)</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      value={personal.monthlyIncome}
                      onChange={(e) => setPersonal({ ...personal, monthlyIncome: e.target.value })}
                      placeholder="e.g. 15000"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── STEP 2: Case Details ── */}
        {step === 2 && (
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-slate-900">Step 2 of 4 — Case Details</CardTitle>
              <CardDescription>Describe the client's legal concern and relevant case information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <SectionHeading icon={Scale} title="Nature of Case" />
                <div className="space-y-4">
                  <div>
                    <FieldLabel required>Case Type</FieldLabel>
                    <Select
                      value={caseDetails.caseType}
                      onValueChange={(v) => setCaseDetails({ ...caseDetails, caseType: v })}
                    >
                      <SelectTrigger className={errors.caseType ? 'border-red-400' : ''}>
                        <SelectValue placeholder="Select legal category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CASE_TYPES).map(([key, val]) => (
                          <SelectItem key={key} value={key}>
                            {val.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError message={errors.caseType} />
                    {caseDetails.caseType && (
                      <p className="text-xs text-slate-500 mt-1.5">
                        {CASE_TYPES[caseDetails.caseType as keyof typeof CASE_TYPES]?.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <FieldLabel required>Case Description</FieldLabel>
                    <Textarea
                      value={caseDetails.caseDescription}
                      onChange={(e) => setCaseDetails({ ...caseDetails, caseDescription: e.target.value })}
                      placeholder="Briefly describe the facts, events, and the legal issue. Include key dates and parties involved."
                      rows={5}
                      className={errors.caseDescription ? 'border-red-400 focus-visible:ring-red-300' : ''}
                    />
                    <div className="flex justify-between mt-1">
                      <FieldError message={errors.caseDescription} />
                      <span className="text-xs text-slate-400 ml-auto">
                        {caseDetails.caseDescription.length} chars
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <SectionHeading icon={FileText} title="Additional Case Information" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Opposing Party</FieldLabel>
                    <Input
                      value={caseDetails.opposingParty}
                      onChange={(e) => setCaseDetails({ ...caseDetails, opposingParty: e.target.value })}
                      placeholder="Name of opposing party"
                    />
                  </div>
                  <div>
                    <FieldLabel>Preferred Court / Venue</FieldLabel>
                    <Input
                      value={caseDetails.courtPreference}
                      onChange={(e) => setCaseDetails({ ...caseDetails, courtPreference: e.target.value })}
                      placeholder="e.g. RTC Calamba, Laguna Branch 35"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <FieldLabel>Desired Outcome / Relief Sought</FieldLabel>
                  <Textarea
                    value={caseDetails.desiredOutcome}
                    onChange={(e) => setCaseDetails({ ...caseDetails, desiredOutcome: e.target.value })}
                    placeholder="What does the client want to achieve? (e.g. return of property, damages, injunction)"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── STEP 3: Eligibility Screening ── */}
        {step === 3 && (
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-slate-900">Step 3 of 4 — Eligibility Screening</CardTitle>
              <CardDescription>
                Evaluate each criterion. Mark Pass, Warning, or Fail based on information gathered from the client.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EligibilityScreener
                criteria={criteria}
                onChange={handleCriterionChange}
                readOnly={false}
              />

              {/* PAO Income Hint */}
              {personal.monthlyIncome && (
                <div
                  className={cn(
                    'mt-4 rounded-lg p-3 text-xs border flex items-start gap-2',
                    parseFloat(personal.monthlyIncome) <= 18000
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  )}
                >
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Means Test:</strong> Declared monthly income of{' '}
                    <strong>₱{parseFloat(personal.monthlyIncome).toLocaleString()}</strong> is{' '}
                    {parseFloat(personal.monthlyIncome) <= 18000
                      ? 'at or below the ₱18,000 PAO eligibility threshold.'
                      : 'above the ₱18,000 PAO threshold — fee-based representation likely applicable.'}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── STEP 4: Review & Submit ── */}
        {step === 4 && (
          <div className="space-y-4">
            {/* Personal Review */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-2 flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base text-slate-900 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Personal Information
                  </CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                  <Edit2 className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                <ReviewRow label="Full Name" value={[personal.firstName, personal.middleName, personal.lastName, personal.suffix].filter(Boolean).join(' ')} />
                <ReviewRow label="Date of Birth" value={personal.dateOfBirth} />
                <ReviewRow label="Gender" value={personal.gender} />
                <ReviewRow label="Civil Status" value={personal.civilStatus} />
                <ReviewRow label="Email" value={personal.email} />
                <ReviewRow label="Phone" value={personal.phone} />
                <ReviewRow label="Alternate Phone" value={personal.alternatePhone} />
                <ReviewRow label="Address" value={[personal.streetAddress, personal.barangay, personal.municipality, personal.province, personal.region, personal.zipCode].filter(Boolean).join(', ')} />
                <ReviewRow label="Occupation" value={personal.occupation} />
                <ReviewRow label="Employer" value={personal.employer} />
                <ReviewRow label="Monthly Income" value={personal.monthlyIncome ? `₱${parseFloat(personal.monthlyIncome).toLocaleString()}` : ''} />
              </CardContent>
            </Card>

            {/* Case Details Review */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-2 flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base text-slate-900 flex items-center gap-2">
                    <Scale className="h-4 w-4 text-blue-600" />
                    Case Details
                  </CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                  <Edit2 className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                <ReviewRow label="Case Type" value={caseDetails.caseType ? CASE_TYPES[caseDetails.caseType as keyof typeof CASE_TYPES]?.label : ''} />
                <ReviewRow label="Description" value={caseDetails.caseDescription} />
                <ReviewRow label="Opposing Party" value={caseDetails.opposingParty} />
                <ReviewRow label="Court / Venue" value={caseDetails.courtPreference} />
                <ReviewRow label="Desired Outcome" value={caseDetails.desiredOutcome} />
              </CardContent>
            </Card>

            {/* Eligibility Review */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-2 flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    Eligibility Screening
                  </CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
                  <Edit2 className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                <EligibilityScreener criteria={criteria} readOnly />
              </CardContent>
            </Card>

            {/* Submit error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                {errors.submit}
              </div>
            )}

            {/* Compliance note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
              <strong>RA 10173 Notice:</strong> Client data is collected under lawful basis and stored securely per NPC guidelines. Client has the right to access, correct, and object to processing of their personal information.
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-2">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {step < 4 ? (
            <Button onClick={handleNext} className="gap-2">
              Next Step
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={isSubmitting}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="h-4 w-4" />
              Submit Intake
            </Button>
          )}
        </div>
      </IntakeWizard>
    </div>
  )
}
