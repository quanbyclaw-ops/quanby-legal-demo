'use client'

// Quanby Case Management Platform – Template Editor with Auto-populate and Live Preview
// Fills {{placeholder}} fields with form data; generates preview document

import { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PHILIPPINE_TEMPLATES } from './TemplateSelector'

// ─── Template content definitions ─────────────────────────────────────────────

const TEMPLATE_CONTENT: Record<string, { title: string; body: string; variables: TemplateVar[] }> = {
  'verified-complaint': {
    title: 'VERIFIED COMPLAINT',
    body: `REPUBLIC OF THE PHILIPPINES
{{court_name}}
{{court_branch}}

{{client_name}},
  Plaintiff,

-versus-                                         Civil Case No. {{case_number}}

{{opposing_party}},
  Defendant.

VERIFIED COMPLAINT

PLAINTIFF {{client_name}}, through undersigned counsel and to this Honorable Court, most respectfully alleges:

PARTIES

1. Plaintiff {{client_name}} is of legal age, Filipino, and residing at {{plaintiff_address}}.

2. Defendant {{opposing_party}} is of legal age and may be served with summons at {{defendant_address}}.

FACTS

3. {{cause_of_action}}

4. Despite demand, defendant has failed and refused to comply with their obligation.

CAUSE OF ACTION

5. The acts of the defendant constitute a violation of plaintiff's rights and cause damage as herein set forth.

PRAYER

WHEREFORE, premises considered, plaintiff respectfully prays that:

a) {{relief_sought}};
b) Attorney's fees and litigation expenses be awarded; and
c) Such other reliefs as are just and equitable under the premises.

{{place_of_filing}}, Philippines, {{date_filed}}.

________________________
{{lawyer_name}}
IBP No. {{ibp_no}}
PTR No. {{ptr_no}}
Roll No. {{roll_no}}
MCLE Compliance No. {{mcle_no}}
Counsel for Plaintiff`,
    variables: [
      { key: 'court_name', label: 'Court Name', type: 'text', required: true, placeholder: 'Regional Trial Court, Branch 45' },
      { key: 'court_branch', label: 'Court Branch & Location', type: 'text', required: true, placeholder: 'Quezon City' },
      { key: 'client_name', label: 'Plaintiff Name', type: 'text', required: true, placeholder: 'Juan Dela Cruz' },
      { key: 'opposing_party', label: 'Defendant Name', type: 'text', required: true, placeholder: 'Pedro Santos' },
      { key: 'case_number', label: 'Case Number', type: 'text', required: false, placeholder: 'CV-2025-0001' },
      { key: 'plaintiff_address', label: 'Plaintiff Address', type: 'text', required: true, placeholder: '123 Mabini St., Quezon City' },
      { key: 'defendant_address', label: 'Defendant Address', type: 'text', required: true, placeholder: '456 Rizal Ave., Manila' },
      { key: 'cause_of_action', label: 'Cause of Action', type: 'textarea', required: true, placeholder: 'Describe the facts giving rise to the cause of action…' },
      { key: 'relief_sought', label: 'Relief Sought', type: 'textarea', required: true, placeholder: 'That defendant be ordered to pay the sum of…' },
      { key: 'place_of_filing', label: 'Place of Filing', type: 'text', required: true, placeholder: 'Quezon City' },
      { key: 'date_filed', label: 'Date Filed', type: 'date', required: true, placeholder: '' },
      { key: 'lawyer_name', label: 'Lawyer Name', type: 'text', required: true, placeholder: 'Atty. Maria Santos' },
      { key: 'ibp_no', label: 'IBP No.', type: 'text', required: false, placeholder: '123456/01-05-25/NCR' },
      { key: 'ptr_no', label: 'PTR No.', type: 'text', required: false, placeholder: '7891011/01-04-25/QC' },
      { key: 'roll_no', label: 'Roll No.', type: 'text', required: false, placeholder: '56789' },
      { key: 'mcle_no', label: 'MCLE Compliance No.', type: 'text', required: false, placeholder: 'VI-0012345' },
    ],
  },
  'demand-letter': {
    title: 'DEMAND LETTER',
    body: `{{date_filed}}

{{recipient_name}}
{{recipient_address}}

Dear {{recipient_name}}:

RE: FORMAL DEMAND — {{demand_subject}}

We represent {{client_name}} in connection with the above-captioned matter.

This is to formally demand from you, within {{deadline_days}} days from receipt hereof, the following:

{{demand_details}}

The total amount demanded is {{amount_demanded}}.

Failure to comply shall constrain our client to institute the necessary legal action before the appropriate court or government agency to enforce their rights, at your expense.

Hoping for your immediate favorable action on this matter.

Very truly yours,

________________________
{{lawyer_name}}
Counsel for {{client_name}}`,
    variables: [
      { key: 'client_name', label: 'Our Client Name', type: 'text', required: true, placeholder: 'ABC Corporation' },
      { key: 'recipient_name', label: 'Recipient Name', type: 'text', required: true, placeholder: 'XYZ Company' },
      { key: 'recipient_address', label: 'Recipient Address', type: 'text', required: true, placeholder: '123 Business Ave., Makati City' },
      { key: 'demand_subject', label: 'Subject of Demand', type: 'text', required: true, placeholder: 'Unpaid Invoices' },
      { key: 'demand_details', label: 'Demand Details', type: 'textarea', required: true, placeholder: 'Describe the specific obligations and amounts…' },
      { key: 'amount_demanded', label: 'Amount Demanded (₱)', type: 'text', required: true, placeholder: '₱500,000.00' },
      { key: 'deadline_days', label: 'Compliance Deadline (days)', type: 'text', required: true, placeholder: '15' },
      { key: 'date_filed', label: 'Date of Letter', type: 'date', required: true, placeholder: '' },
      { key: 'lawyer_name', label: 'Signing Lawyer', type: 'text', required: true, placeholder: 'Atty. Juan Dela Cruz' },
    ],
  },
  'special-power-of-attorney': {
    title: 'SPECIAL POWER OF ATTORNEY',
    body: `KNOW ALL MEN BY THESE PRESENTS:

I, {{principal_name}}, of legal age, Filipino, and residing at {{principal_address}}, do hereby name, constitute, and appoint {{agent_name}}, of legal age, Filipino, and residing at {{agent_address}}, as my true and lawful attorney-in-fact, for me and in my name, place, and stead, to do and perform the following acts and things:

{{specific_authority}}

HEREBY GIVING AND GRANTING unto my said attorney-in-fact full power and authority to do and perform all and every act and thing whatsoever requisite and necessary to carry into effect the foregoing, as fully, to all intents and purposes, as I might or could do if personally present, and hereby ratifying and confirming all that my said attorney-in-fact shall lawfully do or cause to be done by virtue of these presents.

IN WITNESS WHEREOF, I have hereunto set my hand this {{date_filed}} in {{place_of_filing}}, Philippines.

________________________
{{principal_name}}
Principal

Government ID: {{principal_id}}

SIGNED IN THE PRESENCE OF:

____________________          ____________________
Witness                        Witness`,
    variables: [
      { key: 'principal_name', label: 'Principal (Grantor) Name', type: 'text', required: true, placeholder: 'Maria Santos' },
      { key: 'principal_address', label: 'Principal Address', type: 'text', required: true, placeholder: '123 Rizal St., Makati City' },
      { key: 'agent_name', label: 'Agent (Attorney-in-Fact) Name', type: 'text', required: true, placeholder: 'Jose Cruz' },
      { key: 'agent_address', label: 'Agent Address', type: 'text', required: true, placeholder: '456 Mabini St., Manila' },
      { key: 'specific_authority', label: 'Specific Authority Granted', type: 'textarea', required: true, placeholder: 'To sell, transfer, and convey my property located at…' },
      { key: 'principal_id', label: 'Government ID Type & Number', type: 'text', required: true, placeholder: 'Passport No. P1234567A' },
      { key: 'date_filed', label: 'Date of Execution', type: 'date', required: true, placeholder: '' },
      { key: 'place_of_filing', label: 'Place of Execution', type: 'text', required: true, placeholder: 'Quezon City' },
    ],
  },
  'deed-of-sale': {
    title: 'DEED OF ABSOLUTE SALE',
    body: `KNOW ALL MEN BY THESE PRESENTS:

This DEED OF ABSOLUTE SALE is entered into by and between:

VENDOR: {{seller_name}}, of legal age, Filipino, and residing at {{seller_address}}, hereinafter referred to as the "VENDOR";

AND

VENDEE: {{buyer_name}}, of legal age, Filipino, and residing at {{buyer_address}}, hereinafter referred to as the "VENDEE";

WITNESSETH:

That for and in consideration of the total sum of {{purchase_price}} (₱{{purchase_price_figure}}), Philippine Currency, the receipt of which is hereby acknowledged to the full satisfaction of the VENDOR, the VENDOR does hereby SELL, TRANSFER, CONVEY, and DELIVER unto the VENDEE, their heirs and assigns, the following described property:

PROPERTY DESCRIPTION:
{{property_description}}

Tax Declaration No.: {{tax_declaration_no}}

The VENDOR warrants that the property is free and clear of all liens and encumbrances, except those stated herein.

IN WITNESS WHEREOF, the parties hereunto affixed their signatures this {{date_filed}} in {{place_of_filing}}, Philippines.

________________________        ________________________
{{seller_name}}                  {{buyer_name}}
VENDOR                           VENDEE`,
    variables: [
      { key: 'seller_name', label: 'Seller (Vendor) Name', type: 'text', required: true, placeholder: 'Jose Dela Cruz' },
      { key: 'seller_address', label: 'Seller Address', type: 'text', required: true, placeholder: '123 Street, Quezon City' },
      { key: 'buyer_name', label: 'Buyer (Vendee) Name', type: 'text', required: true, placeholder: 'Maria Santos' },
      { key: 'buyer_address', label: 'Buyer Address', type: 'text', required: true, placeholder: '456 Avenue, Manila' },
      { key: 'property_description', label: 'Property Description', type: 'textarea', required: true, placeholder: 'A parcel of land situated in Barangay…' },
      { key: 'purchase_price', label: 'Purchase Price (words)', type: 'text', required: true, placeholder: 'One Million Pesos' },
      { key: 'purchase_price_figure', label: 'Purchase Price (figures)', type: 'text', required: true, placeholder: '1,000,000.00' },
      { key: 'tax_declaration_no', label: 'Tax Declaration No.', type: 'text', required: true, placeholder: 'TD-2024-00123' },
      { key: 'date_filed', label: 'Date of Execution', type: 'date', required: true, placeholder: '' },
      { key: 'place_of_filing', label: 'Place of Execution', type: 'text', required: true, placeholder: 'Quezon City' },
    ],
  },
}

// ─── Fallback template ─────────────────────────────────────────────────────────

function getTemplateContent(templateId: string) {
  if (TEMPLATE_CONTENT[templateId]) return TEMPLATE_CONTENT[templateId]

  // Generic fallback
  const tmpl = PHILIPPINE_TEMPLATES.find(t => t.id === templateId)
  return {
    title: tmpl?.name ?? 'Legal Document',
    body: `REPUBLIC OF THE PHILIPPINES

{{court_name}}

{{client_name}},
  Petitioner/Plaintiff,

-versus-

{{opposing_party}},
  Respondent/Defendant.

[Content of ${tmpl?.name ?? 'document'} will be filled in based on the information provided below.]

Respectfully submitted,

{{place_of_filing}}, Philippines, {{date_filed}}.

________________________
{{lawyer_name}}
Roll No. {{roll_no}}
IBP No. {{ibp_no}}
MCLE No. {{mcle_no}}`,
    variables: [
      { key: 'court_name', label: 'Court Name', type: 'text' as const, required: true, placeholder: 'Regional Trial Court, Branch 45' },
      { key: 'client_name', label: 'Client / Petitioner Name', type: 'text' as const, required: true, placeholder: 'Juan Dela Cruz' },
      { key: 'opposing_party', label: 'Opposing Party', type: 'text' as const, required: false, placeholder: 'Pedro Santos' },
      { key: 'place_of_filing', label: 'Place', type: 'text' as const, required: true, placeholder: 'Quezon City' },
      { key: 'date_filed', label: 'Date', type: 'date' as const, required: true, placeholder: '' },
      { key: 'lawyer_name', label: 'Lawyer Name', type: 'text' as const, required: true, placeholder: 'Atty. Maria Santos' },
      { key: 'roll_no', label: 'Roll No.', type: 'text' as const, required: false, placeholder: '56789' },
      { key: 'ibp_no', label: 'IBP No.', type: 'text' as const, required: false, placeholder: '123456/01-05-25/NCR' },
      { key: 'mcle_no', label: 'MCLE No.', type: 'text' as const, required: false, placeholder: 'VI-0012345' },
    ],
  }
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TemplateVar {
  key: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'number' | 'select'
  required: boolean
  placeholder: string
  options?: string[]
}

interface TemplateEditorProps {
  templateId: string
  onBack: () => void
  onClose: () => void
}

// ─── Highlight placeholders in preview ────────────────────────────────────────

function renderPreview(body: string, values: Record<string, string>): string {
  let result = body
  for (const [key, value] of Object.entries(values)) {
    if (value) {
      result = result.replaceAll(`{{${key}}}`, `<mark class="bg-green-100 text-green-800 rounded px-0.5">${value}</mark>`)
    }
  }
  // Highlight remaining unfilled placeholders
  result = result.replaceAll(/\{\{(\w+)\}\}/g, '<mark class="bg-yellow-100 text-yellow-700 rounded px-0.5 italic">[$1]</mark>')
  return result
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function TemplateEditor({ templateId, onBack, onClose }: TemplateEditorProps) {
  const content = getTemplateContent(templateId)
  const [values, setValues] = useState<Record<string, string>>({})
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const setValue = useCallback((key: string, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }))
  }, [])

  const preview = useMemo(() => renderPreview(content.body, values), [content.body, values])

  const requiredFilled = content.variables
    .filter(v => v.required)
    .every(v => !!values[v.key]?.trim())

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1500))
    setGenerating(false)
    setGenerated(true)
  }

  const handleDownload = () => {
    // Build plain-text version
    let text = content.body
    for (const [key, value] of Object.entries(values)) {
      text = text.replaceAll(`{{${key}}}`, value || `[${key}]`)
    }
    text = text.replaceAll(/\{\{(\w+)\}\}/g, '[$1]')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${content.title.replace(/\s+/g, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-navy-950 flex items-center gap-1">
          ← Back to Templates
        </button>
        <span className="text-gray-300">|</span>
        <h3 className="font-semibold text-navy-950">{content.title}</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ─── Form panel ─── */}
        <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
            <strong>Auto-populate:</strong> Fill in the fields below. The document preview updates in real-time.
            Fields highlighted in <span className="bg-yellow-100 text-yellow-700 px-1 rounded">yellow</span> still need values.
          </div>

          {content.variables.map(variable => (
            <div key={variable.key}>
              <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                {variable.label}
                {variable.required && <span className="text-red-500">*</span>}
              </label>

              {variable.type === 'textarea' ? (
                <Textarea
                  value={values[variable.key] ?? ''}
                  onChange={e => setValue(variable.key, e.target.value)}
                  placeholder={variable.placeholder}
                  className="text-sm min-h-[80px]"
                />
              ) : variable.type === 'select' && variable.options ? (
                <Select
                  value={values[variable.key] ?? ''}
                  onValueChange={val => setValue(variable.key, val)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {variable.options.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={variable.type === 'date' ? 'date' : 'text'}
                  value={values[variable.key] ?? ''}
                  onChange={e => setValue(variable.key, e.target.value)}
                  placeholder={variable.placeholder}
                  className="text-sm"
                />
              )}
            </div>
          ))}
        </div>

        {/* ─── Preview panel ─── */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex flex-col max-h-[65vh]">
          <div className="bg-navy-950 text-white px-4 py-2 flex items-center justify-between shrink-0">
            <span className="text-xs font-semibold">📄 Live Document Preview</span>
            <span className="text-xs text-blue-300">Updates as you type</span>
          </div>
          <div className="overflow-y-auto flex-1 p-4">
            <pre
              className="text-xs text-gray-800 font-mono whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        </div>
      </div>

      {/* ─── Actions ─── */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          {content.variables.filter(v => v.required && !values[v.key]).length > 0
            ? `⚠️ ${content.variables.filter(v => v.required && !values[v.key]).length} required field(s) remaining`
            : '✅ All required fields filled'}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          {generated ? (
            <Button size="sm" variant="outline" onClick={handleDownload} className="border-green-300 text-green-700">
              ⬇️ Download .txt
            </Button>
          ) : null}
          <Button
            size="sm"
            disabled={!requiredFilled || generating}
            onClick={handleGenerate}
            className="bg-navy-950 hover:bg-navy-800 text-white"
          >
            {generating ? (
              <span className="flex items-center gap-2"><span className="animate-spin">⏳</span> Generating…</span>
            ) : generated ? (
              '✅ Generated! Download Above'
            ) : (
              '📄 Generate PDF'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
