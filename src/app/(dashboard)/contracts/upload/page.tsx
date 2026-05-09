'use client'

// Quanby Legal Platform – Contract Upload Page
// Drag-and-drop upload + metadata form + AI analysis trigger

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ContractUploader } from '@/components/contracts/ContractUploader'
import { ComplianceBadge } from '@/components/layout/ComplianceBadge'
import { Badge } from '@/components/ui/badge'

const CONTRACT_TYPES = [
  'SERVICE', 'NDA', 'EMPLOYMENT', 'LEASE', 'SALE', 'MOA', 'MOU',
  'PARTNERSHIP', 'LOAN', 'DEED_OF_SALE', 'POWER_OF_ATTORNEY', 'FRANCHISE',
  'CONSTRUCTION', 'SUPPLY', 'RETAINER', 'OTHER',
]

const TYPE_LABELS: Record<string, string> = {
  SERVICE: 'Service Agreement', NDA: 'Non-Disclosure Agreement',
  EMPLOYMENT: 'Employment Contract', LEASE: 'Lease Agreement',
  SALE: 'Contract of Sale', MOA: 'Memorandum of Agreement',
  MOU: 'Memorandum of Understanding', PARTNERSHIP: 'Partnership Agreement',
  LOAN: 'Loan Agreement / Promissory Note', DEED_OF_SALE: 'Deed of Absolute Sale',
  POWER_OF_ATTORNEY: 'Power of Attorney', FRANCHISE: 'Franchise Agreement',
  CONSTRUCTION: 'Construction Contract', SUPPLY: 'Supply Agreement',
  RETAINER: 'Legal Retainer Agreement', OTHER: 'Other',
}

interface Party { name: string; role: string; email?: string }

function AnalyzingAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm">
      <div className="rounded-2xl bg-white p-8 shadow-2xl max-w-sm w-full mx-4 text-center">
        <div className="relative mx-auto mb-6 h-20 w-20">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin" />
          {/* Inner pulse */}
          <div className="absolute inset-3 rounded-full bg-blue-50 flex items-center justify-center">
            <span className="text-2xl animate-pulse">🧠</span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-navy-950 mb-2">AI Analysis in Progress</h3>
        <p className="text-sm text-gray-500 mb-4">
          Scanning contract for risks, compliance issues, and clause analysis using Philippine law context...
        </p>
        <div className="space-y-2 text-left">
          {[
            { label: 'Parsing contract structure', done: true },
            { label: 'Identifying key clauses', done: true },
            { label: 'Risk assessment', done: false },
            { label: 'Philippine law compliance check', done: false },
            { label: 'SC Rules verification', done: false },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              {step.done ? (
                <svg className="h-4 w-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-blue-300 border-t-blue-600 animate-spin flex-shrink-0" />
              )}
              <span className={`text-xs ${step.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ContractUploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [parties, setParties] = useState<Party[]>([
    { name: '', role: 'Party A', email: '' },
    { name: '', role: 'Party B', email: '' },
  ])
  const [effectiveDate, setEffectiveDate] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [value, setValue] = useState('')
  const [linkedCase, setLinkedCase] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleFileSelect = useCallback((f: File) => {
    setFile(f)
    // Auto-fill title from filename
    if (!title) {
      const name = f.name.replace(/\.(pdf|docx|doc)$/i, '').replace(/[-_]/g, ' ')
      setTitle(name)
    }
  }, [title])

  const addParty = () => setParties(prev => [...prev, { name: '', role: `Party ${String.fromCharCode(65 + prev.length)}`, email: '' }])
  const removeParty = (i: number) => setParties(prev => prev.filter((_, idx) => idx !== i))
  const updateParty = (i: number, field: keyof Party, val: string) =>
    setParties(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!file) e.file = 'Please select a contract file'
    if (!title.trim()) e.title = 'Contract title is required'
    if (!type) e.type = 'Contract type is required'
    if (parties.some(p => !p.name.trim())) e.parties = 'All party names are required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsAnalyzing(true)
    // Simulate analysis delay (2.5s)
    await new Promise(r => setTimeout(r, 2500))
    setIsAnalyzing(false)
    router.push('/contracts/clx001')
  }

  return (
    <>
      {isAnalyzing && <AnalyzingAnimation />}

      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-950">Upload Contract</h1>
            <p className="text-sm text-gray-500 mt-1">
              Upload a contract for AI-powered analysis and Philippine law compliance review
            </p>
          </div>
          <ComplianceBadge standard="SC-RULES" variant="compact" />
        </div>

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500">
          <Link href="/dashboard" className="hover:text-navy-950">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link href="/contracts" className="hover:text-navy-950">Contract Agent</Link>
          <span className="mx-2">/</span>
          <span className="text-navy-950 font-medium">Upload</span>
        </nav>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Zone */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-navy-950 mb-1">Contract File</h2>
            <p className="text-xs text-gray-500 mb-4">Supported formats: PDF, DOCX, DOC — up to 50MB</p>
            <ContractUploader
              onFileSelect={handleFileSelect}
              onFileRemove={() => setFile(null)}
              selectedFile={file}
            />
            {errors.file && <p className="mt-2 text-sm text-red-600">{errors.file}</p>}
          </div>

          {/* Metadata Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="font-bold text-navy-950">Contract Details</h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Service Agreement – Company Name"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Type <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select contract type...</option>
                {CONTRACT_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t] ?? t}</option>)}
              </select>
              {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
            </div>

            {/* Parties */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Parties <span className="text-red-500">*</span>
                </label>
                <button type="button" onClick={addParty} className="text-xs text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add party
                </button>
              </div>
              <div className="space-y-2">
                {parties.map((party, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={party.name}
                        onChange={e => updateParty(i, 'name', e.target.value)}
                        placeholder={`${party.role} name`}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={party.role}
                        onChange={e => updateParty(i, 'role', e.target.value)}
                        placeholder="Role"
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {parties.length > 2 && (
                      <button type="button" onClick={() => removeParty(i)} className="mt-2 text-gray-300 hover:text-red-500 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.parties && <p className="mt-1 text-xs text-red-600">{errors.parties}</p>}
            </div>

            {/* Dates + Value */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                <input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                <input type="date" value={expirationDate} onChange={e => setExpirationDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Value (PHP)</label>
                <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="0.00"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Linked Case */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link to Existing Case (optional)</label>
              <select value={linkedCase} onChange={e => setLinkedCase(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">No linked case</option>
                <option value="case001">QLP-2026-001 – Santos vs. Garcia</option>
                <option value="case002">QLP-2026-002 – People vs. Reyes</option>
                <option value="case003">QLP-2026-003 – LGU Procurement Dispute</option>
              </select>
            </div>
          </div>

          {/* AI Analysis Info */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex gap-3">
            <span className="text-xl flex-shrink-0">🤖</span>
            <div>
              <p className="text-sm font-semibold text-blue-900">AI Analysis will automatically run after upload</p>
              <p className="text-xs text-blue-700 mt-0.5">
                The Contract Agent will analyze for risks, compliance with Philippine law (RA 386, RA 10173, RA 8792),
                Supreme Court Rules, and generate actionable recommendations.
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 justify-end">
            <Link href="/contracts" className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="flex items-center gap-2 rounded-xl bg-navy-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors disabled:opacity-50 shadow"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload &amp; Analyze
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
