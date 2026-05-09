'use client'

// Quanby Legal Platform – Contract Template Generator
// Template selection, variable filling, preview, and download

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface TemplateVariable {
  key: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'number' | 'select'
  required: boolean
  placeholder?: string
  options?: string[]
}

interface ContractTemplateConfig {
  id: string
  name: string
  description: string
  icon: string
  category: string
  variables: TemplateVariable[]
}

const TEMPLATES: ContractTemplateConfig[] = [
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement',
    description: 'Bilateral confidentiality agreement with Philippine law provisions',
    icon: '🔒',
    category: 'Confidentiality',
    variables: [
      { key: 'partyA', label: 'Disclosing Party (Full Name)', type: 'text', required: true, placeholder: 'e.g., Acme Corporation' },
      { key: 'partyB', label: 'Receiving Party (Full Name)', type: 'text', required: true, placeholder: 'e.g., Juan dela Cruz' },
      { key: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
      { key: 'duration', label: 'Confidentiality Period (years)', type: 'number', required: true, placeholder: '3' },
      { key: 'purpose', label: 'Purpose of Disclosure', type: 'textarea', required: true, placeholder: 'e.g., Evaluation of potential business partnership' },
      { key: 'jurisdiction', label: 'Jurisdiction', type: 'select', required: true, options: ['Makati City', 'Quezon City', 'Manila', 'Pasig City', 'Taguig City'] },
    ],
  },
  {
    id: 'service',
    name: 'Service Agreement',
    description: 'Professional services contract compliant with Philippine labor and commercial law',
    icon: '🤝',
    category: 'Services',
    variables: [
      { key: 'clientName', label: 'Client Name', type: 'text', required: true },
      { key: 'providerName', label: 'Service Provider Name', type: 'text', required: true },
      { key: 'serviceName', label: 'Service Description', type: 'textarea', required: true },
      { key: 'contractValue', label: 'Contract Value (PHP)', type: 'number', required: true },
      { key: 'startDate', label: 'Start Date', type: 'date', required: true },
      { key: 'endDate', label: 'End Date', type: 'date', required: true },
      { key: 'paymentTerms', label: 'Payment Terms', type: 'select', required: true, options: ['Net 15', 'Net 30', 'Net 45', 'Upon completion', 'Monthly'] },
    ],
  },
  {
    id: 'retainer',
    name: 'Legal Retainer Agreement',
    description: 'Attorney retainer agreement per IBP and SC Rules of Court guidelines',
    icon: '⚖️',
    category: 'Legal Services',
    variables: [
      { key: 'clientName', label: 'Client Full Name', type: 'text', required: true },
      { key: 'lawyerName', label: "Lawyer's Full Name", type: 'text', required: true },
      { key: 'barNumber', label: 'Bar Roll Number', type: 'text', required: true },
      { key: 'legalServices', label: 'Scope of Legal Services', type: 'textarea', required: true },
      { key: 'retainerFee', label: 'Monthly Retainer Fee (PHP)', type: 'number', required: true },
      { key: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
    ],
  },
  {
    id: 'moa',
    name: 'Memorandum of Agreement',
    description: 'MOA template suitable for government, NGO, and inter-agency arrangements',
    icon: '📜',
    category: 'Government',
    variables: [
      { key: 'party1', label: 'First Party (Agency/Organization)', type: 'text', required: true },
      { key: 'party2', label: 'Second Party (Agency/Organization)', type: 'text', required: true },
      { key: 'purpose', label: 'Purpose of Agreement', type: 'textarea', required: true },
      { key: 'obligations1', label: 'Obligations of First Party', type: 'textarea', required: true },
      { key: 'obligations2', label: 'Obligations of Second Party', type: 'textarea', required: true },
      { key: 'duration', label: 'Agreement Duration (months)', type: 'number', required: true },
      { key: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
    ],
  },
  {
    id: 'employment',
    name: 'Employment Contract',
    description: 'Regular employment contract compliant with Labor Code of the Philippines',
    icon: '👔',
    category: 'Employment',
    variables: [
      { key: 'employerName', label: 'Employer (Company Name)', type: 'text', required: true },
      { key: 'employeeName', label: "Employee's Full Name", type: 'text', required: true },
      { key: 'position', label: 'Position/Job Title', type: 'text', required: true },
      { key: 'department', label: 'Department', type: 'text', required: false },
      { key: 'salary', label: 'Monthly Salary (PHP)', type: 'number', required: true },
      { key: 'startDate', label: 'Employment Start Date', type: 'date', required: true },
      { key: 'employmentType', label: 'Employment Type', type: 'select', required: true, options: ['Regular', 'Probationary (6 months)', 'Project-based', 'Fixed-term', 'Part-time'] },
    ],
  },
]

function generatePreviewText(template: ContractTemplateConfig, values: Record<string, string>): string {
  const filled = (key: string, fallback: string) => values[key] || `[${fallback}]`
  const today = new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })

  switch (template.id) {
    case 'nda':
      return `NON-DISCLOSURE AGREEMENT\n\nThis Non-Disclosure Agreement ("Agreement") is entered into as of ${filled('effectiveDate', 'EFFECTIVE DATE')}, by and between:\n\n${filled('partyA', 'DISCLOSING PARTY')} ("Disclosing Party")\nand\n${filled('partyB', 'RECEIVING PARTY')} ("Receiving Party").\n\nPURPOSE\nThis Agreement is entered into for the purpose of: ${filled('purpose', 'PURPOSE')}\n\nCONFIDENTIALITY OBLIGATIONS\nThe Receiving Party agrees to maintain the confidentiality of all Confidential Information disclosed by the Disclosing Party for a period of ${filled('duration', 'X')} years from the date of disclosure.\n\nGOVERNING LAW\nThis Agreement shall be governed by the laws of the Republic of the Philippines. Any disputes shall be resolved in the courts of ${filled('jurisdiction', 'JURISDICTION')}.\n\nThis Agreement complies with Republic Act No. 10173 (Data Privacy Act) and is executed in accordance with Philippine law.\n\n_______________________        _______________________\n${filled('partyA', 'DISCLOSING PARTY')}          ${filled('partyB', 'RECEIVING PARTY')}`
    case 'employment':
      return `EMPLOYMENT CONTRACT\n\nThis Employment Contract is entered into as of ${today}, between:\n\n${filled('employerName', 'EMPLOYER')}, a company duly organized under Philippine law ("Employer")\nand\n${filled('employeeName', 'EMPLOYEE')}, a Filipino citizen ("Employee").\n\nPOSITION AND DUTIES\nThe Employer hereby employs the Employee as ${filled('position', 'POSITION')}${values.department ? ` in the ${values.department} Department` : ''}, effective ${filled('startDate', 'START DATE')}.\n\nCOMPENSATION\nThe Employee shall receive a monthly salary of PHP ${filled('salary', 'AMOUNT')}, subject to mandatory deductions for SSS, PhilHealth, Pag-IBIG, and applicable income taxes.\n\nEMPLOYMENT STATUS\nType: ${filled('employmentType', 'TYPE')}\n\nThis contract is executed in compliance with the Labor Code of the Philippines (PD 442, as amended) and applicable Department of Labor and Employment issuances.`
    default:
      return `${template.name.toUpperCase()}\n\nThis ${template.name} is entered into pursuant to applicable Philippine laws and regulations.\n\n${template.variables.map(v => `${v.label}: ${values[v.key] || `[${v.label}]`}`).join('\n')}\n\nThis document is Philippine Law Compliant and SC Rules Aware.\nGenerated by Quanby Legal Platform — ${today}`
  }
}

export function TemplateGenerator({ onGenerate }: { onGenerate?: (templateId: string, values: Record<string, string>) => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplateConfig | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!selectedTemplate) return
    setIsGenerating(true)
    await new Promise(r => setTimeout(r, 1500))
    onGenerate?.(selectedTemplate.id, values)
    setIsGenerating(false)
    setShowPreview(false)
    alert(`"${selectedTemplate.name}" generated successfully! In production, this would download as a DOCX/PDF file.`)
  }

  const allRequired = selectedTemplate?.variables.filter(v => v.required).every(v => values[v.key]?.trim()) ?? false

  if (!selectedTemplate) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-navy-950">Generate from Template</h3>
          <Badge variant="info">5 templates available</Badge>
        </div>
        <p className="text-sm text-gray-500">Select a Philippine law-compliant contract template to get started.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTemplate(t)}
              className="text-left rounded-xl border-2 border-gray-200 bg-white p-4 hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
            >
              <div className="text-3xl mb-3">{t.icon}</div>
              <p className="font-semibold text-navy-950 text-sm group-hover:text-blue-700">{t.name}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{t.description}</p>
              <span className="mt-2 inline-block text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                {t.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => { setSelectedTemplate(null); setValues({}); setShowPreview(false) }}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-navy-950 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Templates
        </button>
        <span className="text-gray-300">/</span>
        <div className="flex items-center gap-2">
          <span className="text-xl">{selectedTemplate.icon}</span>
          <span className="font-semibold text-navy-950">{selectedTemplate.name}</span>
        </div>
      </div>

      <div className={cn('grid gap-6', showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1')}>
        {/* Variables form */}
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
          <div className="space-y-3">
            {selectedTemplate.variables.map(v => (
              <div key={v.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {v.label}
                  {v.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {v.type === 'textarea' ? (
                  <textarea
                    value={values[v.key] ?? ''}
                    onChange={e => setValues(prev => ({ ...prev, [v.key]: e.target.value }))}
                    placeholder={v.placeholder}
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                ) : v.type === 'select' ? (
                  <select
                    value={values[v.key] ?? ''}
                    onChange={e => setValues(prev => ({ ...prev, [v.key]: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select {v.label}</option>
                    {v.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type={v.type}
                    value={values[v.key] ?? ''}
                    onChange={e => setValues(prev => ({ ...prev, [v.key]: e.target.value }))}
                    placeholder={v.placeholder}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {showPreview ? 'Hide Preview' : 'Preview'}
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!allRequired || isGenerating}
              className="flex items-center gap-1.5 rounded-lg bg-navy-950 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Contract
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live preview */}
        {showPreview && (
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Live Preview</p>
              <div className="flex gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>
            </div>
            <div className="p-4 font-mono text-xs text-gray-700 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {generatePreviewText(selectedTemplate, values)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
