'use client'

// Quanby Case Management Platform – e-Notarization Step Flow
// Steps: Select Document → Verify Identity → Review → Notarize → Certificate

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { NotarizationCertificate, type NotarizationCertificateData } from './NotarizationCertificate'

// ─── Constants ─────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Select Document',      icon: '📄', description: 'Choose document & upload supporting ID' },
  { id: 2, label: 'Verify Identity',      icon: '🪪', description: 'Biometric identity check' },
  { id: 3, label: 'Review Document',      icon: '🔍', description: 'Acknowledge content & consent' },
  { id: 4, label: 'Notarize',             icon: '⚖️', description: 'Enter notary details & notarize' },
  { id: 5, label: 'Certificate Issued',   icon: '🏅', description: 'Download notarization certificate' },
]

const MOCK_DOCUMENTS = [
  { id: 'doc-1', title: 'Verified Complaint – Santos v. Reyes', type: 'PLEADING' },
  { id: 'doc-2', title: 'Special Power of Attorney – Juan dela Cruz', type: 'CERTIFICATE' },
  { id: 'doc-3', title: 'Deed of Absolute Sale – Lot 4 Block 7', type: 'CONTRACT' },
  { id: 'doc-4', title: 'Compromise Agreement – Labor Case 001', type: 'CONTRACT' },
  { id: 'doc-5', title: 'Judicial Affidavit – Witness Maria Cruz', type: 'AFFIDAVIT' },
]

const ACCEPTED_ID_TYPES = [
  "Passport",
  "Driver's License",
  "PhilSys (National ID)",
  "UMID",
  "Voter's ID",
  "PRC ID",
  "SSS ID",
  "TIN ID",
]

// ─── Step Progress Bar ────────────────────────────────────────────────────────

function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
      {STEPS.map((step, idx) => (
        <div key={step.id} className="flex items-center flex-1 min-w-0">
          {/* Step circle */}
          <div className="flex flex-col items-center shrink-0">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                step.id < current
                  ? 'bg-green-500 border-green-500 text-white'
                  : step.id === current
                  ? 'bg-navy-950 border-navy-950 text-white shadow-md scale-110'
                  : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}
            >
              {step.id < current ? '✓' : step.icon}
            </div>
            <p className={`text-xs mt-1 text-center max-w-[70px] leading-tight ${
              step.id === current ? 'text-navy-950 font-semibold' : 'text-gray-400'
            }`}>
              {step.label}
            </p>
          </div>
          {/* Connector */}
          {idx < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 min-w-[8px] ${
              step.id < current ? 'bg-green-400' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Step 1: Document Selection ───────────────────────────────────────────────

function Step1DocumentSelect({
  onNext,
}: {
  onNext: (docId: string, docTitle: string, idType: string) => void
}) {
  const [selectedDoc, setSelectedDoc] = useState('')
  const [idType, setIdType] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [idUploaded, setIdUploaded] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const canProceed = selectedDoc && idType && idNumber && idUploaded

  const selectedDocTitle = MOCK_DOCUMENTS.find(d => d.id === selectedDoc)?.title ?? ''

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-navy-950 mb-1">Step 1: Select Document for Notarization</h3>
        <p className="text-sm text-gray-500">Choose the document you want notarized and upload a valid government-issued ID.</p>
      </div>

      {/* Document select */}
      <div>
        <label className="text-xs font-semibold text-gray-700 mb-2 block">
          Document to Notarize <span className="text-red-500">*</span>
        </label>
        <Select value={selectedDoc} onValueChange={setSelectedDoc}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Select a document…" />
          </SelectTrigger>
          <SelectContent>
            {MOCK_DOCUMENTS.map(doc => (
              <SelectItem key={doc.id} value={doc.id}>
                <span className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 text-gray-600 rounded px-1">{doc.type}</span>
                  <span>{doc.title}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ID upload */}
      <div className="border border-gray-200 rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold text-navy-950">Government-Issued ID</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">ID Type <span className="text-red-500">*</span></label>
            <Select value={idType} onValueChange={setIdType}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select ID type…" />
              </SelectTrigger>
              <SelectContent>
                {ACCEPTED_ID_TYPES.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">ID Number <span className="text-red-500">*</span></label>
            <Input
              value={idNumber}
              onChange={e => setIdNumber(e.target.value)}
              placeholder="Enter ID number…"
              className="text-sm"
            />
          </div>
        </div>
        {/* ID scan upload */}
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            idUploaded ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
          onClick={() => fileRef.current?.click()}
        >
          {idUploaded ? (
            <div>
              <span className="text-2xl">✅</span>
              <p className="text-sm text-green-700 font-medium mt-1">ID uploaded successfully</p>
            </div>
          ) : (
            <div>
              <span className="text-2xl">🪪</span>
              <p className="text-sm text-gray-600 mt-1">Click to upload ID scan or photo</p>
              <p className="text-xs text-gray-400">JPG, PNG or PDF · Max 5 MB</p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={() => setIdUploaded(true)}
          />
        </div>
      </div>

      {/* Privacy notice */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
        <span>⚠️</span>
        <span>
          ID information is encrypted and processed solely for identity verification. Retained
          for 1 year per <strong>RA 10173</strong> requirements, then securely deleted.
        </span>
      </div>

      <Button
        disabled={!canProceed}
        onClick={() => onNext(selectedDoc, selectedDocTitle, `${idType} – ${idNumber}`)}
        className="w-full bg-navy-950 hover:bg-navy-800 text-white"
      >
        Proceed to Identity Verification →
      </Button>
    </div>
  )
}

// ─── Step 2: Identity Verification ───────────────────────────────────────────

function Step2IdentityVerification({
  idInfo,
  onNext,
  onBack,
}: {
  idInfo: string
  onNext: () => void
  onBack: () => void
}) {
  const [stage, setStage] = useState<'idle' | 'checking' | 'done'>('idle')
  const [checks, setChecks] = useState({
    docCheck: false,
    faceMatch: false,
    livenessCheck: false,
    dbVerification: false,
  })

  const runVerification = async () => {
    setStage('checking')
    const keys = Object.keys(checks) as (keyof typeof checks)[]
    for (const key of keys) {
      await new Promise(r => setTimeout(r, 700))
      setChecks(prev => ({ ...prev, [key]: true }))
    }
    setStage('done')
  }

  const checkLabels: Record<keyof typeof checks, string> = {
    docCheck:        '🪪 ID Document Authenticity Check',
    faceMatch:       '👤 Facial Recognition Match',
    livenessCheck:   '🔴 Liveness Detection',
    dbVerification:  '🗄️ Government Database Cross-reference',
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-navy-950 mb-1">Step 2: Identity Verification</h3>
        <p className="text-sm text-gray-500">Biometric identity verification is required before notarization.</p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
        <p className="text-xs text-gray-500 mb-1">Submitted ID</p>
        <p className="font-semibold text-navy-950">{idInfo}</p>
      </div>

      {/* Biometric check panel */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-navy-950 text-white px-4 py-3">
          <p className="text-sm font-semibold">🔍 Biometric Verification Checks</p>
          <p className="text-xs text-blue-300">Simulated identity verification for demo purposes</p>
        </div>
        <div className="p-4 space-y-3">
          {Object.entries(checkLabels).map(([key, label]) => {
            const done = checks[key as keyof typeof checks]
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{label}</span>
                <span className={`text-sm font-medium ${done ? 'text-green-600' : stage === 'checking' ? 'text-amber-500 animate-pulse' : 'text-gray-300'}`}>
                  {done ? '✅ Verified' : stage === 'checking' ? '⏳ Checking…' : '○ Pending'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {stage === 'done' && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
          <span className="text-3xl">✅</span>
          <div>
            <p className="font-semibold text-green-800">Identity Verified Successfully</p>
            <p className="text-xs text-green-600">All biometric checks passed. You may proceed to document review.</p>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">← Back</Button>
        {stage === 'idle' && (
          <Button onClick={runVerification} className="flex-1 bg-navy-950 hover:bg-navy-800 text-white">
            🔍 Run Verification
          </Button>
        )}
        {stage === 'checking' && (
          <Button disabled className="flex-1">
            <span className="animate-spin mr-2">⏳</span> Verifying…
          </Button>
        )}
        {stage === 'done' && (
          <Button onClick={onNext} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
            ✅ Proceed to Review →
          </Button>
        )}
      </div>
    </div>
  )
}

// ─── Step 3: Document Review ──────────────────────────────────────────────────

function Step3DocumentReview({
  docTitle,
  onNext,
  onBack,
}: {
  docTitle: string
  onNext: () => void
  onBack: () => void
}) {
  const [checked, setChecked] = useState({
    identityCorrect: false,
    documentReviewed: false,
    noCoercion: false,
    privacyConsent: false,
    legalEffect: false,
  })

  const allChecked = Object.values(checked).every(Boolean)

  const checkboxes: Array<{ key: keyof typeof checked; label: string }> = [
    { key: 'identityCorrect',   label: 'I confirm that the information in my submitted ID is accurate and correct.' },
    { key: 'documentReviewed',  label: `I have read and understood the full contents of "${docTitle}" and confirm all information is accurate.` },
    { key: 'noCoercion',        label: 'I am signing this document freely, voluntarily, and without coercion or undue influence.' },
    { key: 'privacyConsent',    label: 'I consent to the processing of my personal data for notarization purposes under RA 10173 (Data Privacy Act).' },
    { key: 'legalEffect',       label: 'I understand that electronic notarization has the same legal effect as traditional notarization under A.M. No. 20-07-04-SC.' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-navy-950 mb-1">Step 3: Document Review & Acknowledgment</h3>
        <p className="text-sm text-gray-500">Please review the document and acknowledge each statement before proceeding.</p>
      </div>

      {/* Document preview */}
      <div className="border border-gray-200 rounded-xl bg-gray-50 p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">📕</span>
          <div>
            <p className="font-semibold text-navy-950 text-sm">{docTitle}</p>
            <p className="text-xs text-gray-500">PDF document · Secure preview</p>
          </div>
        </div>
        <div className="border border-dashed border-gray-300 rounded-lg bg-white h-24 flex items-center justify-center">
          <p className="text-xs text-gray-400">📄 Document preview — verify all content before notarization</p>
        </div>
      </div>

      {/* Acknowledgment checkboxes */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Required Acknowledgments</p>
        {checkboxes.map(cb => (
          <label key={cb.key} className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={checked[cb.key]}
              onChange={e => setChecked(prev => ({ ...prev, [cb.key]: e.target.checked }))}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer shrink-0"
            />
            <span className={`text-sm leading-snug transition-colors ${
              checked[cb.key] ? 'text-gray-800' : 'text-gray-600 group-hover:text-gray-800'
            }`}>
              {cb.label}
            </span>
          </label>
        ))}
      </div>

      {allChecked && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
          <span>✅</span>
          <span>All acknowledgments confirmed. You may proceed to notarization.</span>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">← Back</Button>
        <Button
          disabled={!allChecked}
          onClick={onNext}
          className="flex-1 bg-navy-950 hover:bg-navy-800 text-white"
        >
          Proceed to Notarization →
        </Button>
      </div>
    </div>
  )
}

// ─── Step 4: Notarization ─────────────────────────────────────────────────────

interface NotaryInfo {
  name: string
  rollNo: string
  ptrNo: string
  ibpNo: string
  mcleNo: string
}

function Step4Notarization({
  onNotarize,
  onBack,
}: {
  onNotarize: (notaryInfo: NotaryInfo) => void
  onBack: () => void
}) {
  const [info, setInfo] = useState<NotaryInfo>({
    name: 'Atty. Maria C. Santos',
    rollNo: '56789',
    ptrNo: '7891011/01-04-25/NCR',
    ibpNo: '123456/01-05-25/NCR',
    mcleNo: 'VII-0012345',
  })
  const [notarizing, setNotarizing] = useState(false)

  const allFilled = Object.values(info).every(v => v.trim())

  const handleNotarize = async () => {
    setNotarizing(true)
    await new Promise(r => setTimeout(r, 2000))
    setNotarizing(false)
    onNotarize(info)
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-navy-950 mb-1">Step 4: Digital Notarization</h3>
        <p className="text-sm text-gray-500">Enter notary public credentials. The digital seal will be affixed to the document.</p>
      </div>

      {/* SC Compliance badge */}
      <div className="flex items-center gap-3 bg-amber-50 border-2 border-amber-400 rounded-xl p-4">
        <span className="text-3xl">⚖️</span>
        <div>
          <p className="font-bold text-amber-900">Supreme Court of the Philippines</p>
          <p className="text-xs text-amber-700">
            Compliant with <strong>A.M. No. 20-07-04-SC</strong> — 2020 Rules on Remote Online Notarization
          </p>
          <p className="text-xs text-amber-600 mt-0.5">
            2004 Rules on Notarial Practice (as amended)
          </p>
        </div>
      </div>

      {/* Notary credentials */}
      <div className="border border-gray-200 rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Notary Public Credentials</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'name' as keyof NotaryInfo,   label: 'Notary Public Name',    placeholder: 'Atty. Full Name' },
            { key: 'rollNo' as keyof NotaryInfo,  label: 'Roll No.',              placeholder: '56789' },
            { key: 'ptrNo' as keyof NotaryInfo,   label: 'PTR No.',               placeholder: '0000000/MM-DD-YY/City' },
            { key: 'ibpNo' as keyof NotaryInfo,   label: 'IBP No.',               placeholder: '000000/MM-DD-YY/Chapter' },
            { key: 'mcleNo' as keyof NotaryInfo,  label: 'MCLE Compliance No.',   placeholder: 'VII-0000000' },
          ].map(field => (
            <div key={field.key} className={field.key === 'name' ? 'col-span-2' : ''}>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                {field.label} <span className="text-red-500">*</span>
              </label>
              <Input
                value={info[field.key]}
                onChange={e => setInfo(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Digital seal preview */}
      <div className="flex items-center gap-4 border border-dashed border-amber-300 rounded-xl p-4 bg-amber-50">
        <div className="shrink-0">
          <div className="w-20 h-20 rounded-full border-4 border-double border-navy-950 bg-white flex items-center justify-center">
            <span className="text-3xl">⚖️</span>
          </div>
        </div>
        <div>
          <p className="font-semibold text-navy-950 text-sm">Digital Notarial Seal Preview</p>
          <p className="text-xs text-gray-600 mt-0.5">Seal will be affixed with cryptographic signature upon notarization</p>
          {info.name && <p className="text-xs text-amber-700 mt-1">Notary: {info.name}</p>}
          {info.rollNo && <p className="text-xs text-amber-700">Roll No. {info.rollNo}</p>}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1" disabled={notarizing}>← Back</Button>
        <Button
          disabled={!allFilled || notarizing}
          onClick={handleNotarize}
          className="flex-1 bg-navy-950 hover:bg-navy-800 text-white"
        >
          {notarizing ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span> Notarizing…
            </span>
          ) : (
            '🏅 Notarize Document'
          )}
        </Button>
      </div>
    </div>
  )
}

// ─── Main Flow Component ──────────────────────────────────────────────────────

interface ENotarizationFlowProps {
  onComplete?: (certData: NotarizationCertificateData) => void
  onClose?: () => void
}

export function ENotarizationFlow({ onComplete, onClose }: ENotarizationFlowProps) {
  const [step, setStep] = useState(1)
  const [docId, setDocId] = useState('')
  const [docTitle, setDocTitle] = useState('')
  const [idInfo, setIdInfo] = useState('')
  const [certificate, setCertificate] = useState<NotarizationCertificateData | null>(null)

  const handleStep1 = (id: string, title: string, id_info: string) => {
    setDocId(id)
    setDocTitle(title)
    setIdInfo(id_info)
    setStep(2)
  }

  const handleStep4 = (notaryInfo: NotaryInfo) => {
    const certNumber = `EN-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const hash = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    const cert: NotarizationCertificateData = {
      certificateNumber: certNumber,
      documentTitle: docTitle,
      documentType: MOCK_DOCUMENTS.find(d => d.id === docId)?.type ?? 'DOCUMENT',
      notaryName: notaryInfo.name,
      notaryRollNo: notaryInfo.rollNo,
      notaryPtrNo: notaryInfo.ptrNo,
      notaryIbpNo: notaryInfo.ibpNo,
      notaryMcleNo: notaryInfo.mcleNo,
      notarizedAt: new Date().toISOString(),
      principalName: 'Juan Dela Cruz',
      principalId: idInfo,
      verificationUrl: `https://verify.quanbylegal.com/notarization/${certNumber}`,
      verificationHash: hash,
    }
    setCertificate(cert)
    setStep(5)
    onComplete?.(cert)
  }

  return (
    <div className="space-y-2">
      <StepProgress current={step} />

      {step === 1 && <Step1DocumentSelect onNext={handleStep1} />}
      {step === 2 && (
        <Step2IdentityVerification
          idInfo={idInfo}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <Step3DocumentReview
          docTitle={docTitle}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <Step4Notarization
          onNotarize={handleStep4}
          onBack={() => setStep(3)}
        />
      )}
      {step === 5 && certificate && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-bold text-green-800">Notarization Complete!</p>
              <p className="text-sm text-green-700">
                Certificate No. <strong>{certificate.certificateNumber}</strong> has been issued.
              </p>
            </div>
          </div>
          <NotarizationCertificate
            data={certificate}
            onClose={onClose}
          />
        </div>
      )}
    </div>
  )
}
