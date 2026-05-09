'use client'

// Quanby Case Management Platform – Philippine Legal Template Selector
// Grid of Philippine legal document templates

import { useState } from 'react'
import { Input } from '@/components/ui/input'

// ─── Template definitions ──────────────────────────────────────────────────────

export const PHILIPPINE_TEMPLATES = [
  {
    id: 'verified-complaint',
    name: 'Verified Complaint',
    description: 'Initiatory pleading filed with the court stating the cause of action under the Rules of Court.',
    category: 'Pleading',
    icon: '📝',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    iconBg: 'bg-blue-100 text-blue-700',
    caseTypes: ['Civil', 'Commercial'],
    requiredFields: ['client_name', 'opposing_party', 'court_name', 'cause_of_action', 'relief_sought'],
  },
  {
    id: 'answer-with-counterclaim',
    name: 'Answer with Counterclaim',
    description: 'Responsive pleading admitting or denying the allegations in the complaint with affirmative defenses.',
    category: 'Pleading',
    icon: '💬',
    color: 'bg-cyan-50 border-cyan-200 hover:border-cyan-400',
    iconBg: 'bg-cyan-100 text-cyan-700',
    caseTypes: ['Civil', 'Commercial'],
    requiredFields: ['defendant_name', 'plaintiff_name', 'case_number', 'court_name'],
  },
  {
    id: 'motion-to-dismiss',
    name: 'Motion to Dismiss',
    description: 'Motion to dismiss based on lack of jurisdiction, improper venue, litis pendentia, or other grounds under Rule 16.',
    category: 'Motion',
    icon: '⚖️',
    color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    iconBg: 'bg-purple-100 text-purple-700',
    caseTypes: ['Civil', 'Criminal'],
    requiredFields: ['case_number', 'court_name', 'movant_name', 'ground_for_dismissal'],
  },
  {
    id: 'affidavit-of-witness',
    name: 'Affidavit of Witness',
    description: 'Sworn statement of a witness submitted as evidence in judicial or quasi-judicial proceedings.',
    category: 'Affidavit',
    icon: '✍️',
    color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
    iconBg: 'bg-indigo-100 text-indigo-700',
    caseTypes: ['Civil', 'Criminal', 'Labor'],
    requiredFields: ['witness_name', 'witness_address', 'case_number', 'statement'],
  },
  {
    id: 'judicial-affidavit',
    name: 'Judicial Affidavit',
    description: 'Affidavit in question-and-answer form replacing direct examination testimony under A.M. No. 12-8-8-SC.',
    category: 'Affidavit',
    icon: '📜',
    color: 'bg-violet-50 border-violet-200 hover:border-violet-400',
    iconBg: 'bg-violet-100 text-violet-700',
    caseTypes: ['Civil', 'Criminal', 'Labor'],
    requiredFields: ['witness_name', 'examining_lawyer', 'case_number', 'court_name'],
  },
  {
    id: 'demand-letter',
    name: 'Demand Letter',
    description: 'Formal written demand for compliance with obligations, payment of debt, or cessation of unlawful acts.',
    category: 'Letter',
    icon: '✉️',
    color: 'bg-gray-50 border-gray-200 hover:border-gray-400',
    iconBg: 'bg-gray-100 text-gray-700',
    caseTypes: ['Civil', 'Commercial', 'Labor'],
    requiredFields: ['client_name', 'recipient_name', 'demand_subject', 'amount_demanded', 'deadline_days'],
  },
  {
    id: 'compromise-agreement',
    name: 'Compromise Agreement',
    description: 'Settlement agreement enforceable as a judgment upon court approval under Art. 2028 of the Civil Code.',
    category: 'Contract',
    icon: '🤝',
    color: 'bg-teal-50 border-teal-200 hover:border-teal-400',
    iconBg: 'bg-teal-100 text-teal-700',
    caseTypes: ['Civil', 'Labor'],
    requiredFields: ['party_a_name', 'party_b_name', 'case_number', 'settlement_terms', 'settlement_amount'],
  },
  {
    id: 'secretarys-certificate',
    name: "Secretary's Certificate",
    description: "Corporate secretary's certification of board resolutions and corporate authority for transactions.",
    category: 'Certificate',
    icon: '🏅',
    color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
    iconBg: 'bg-yellow-100 text-yellow-700',
    caseTypes: ['Commercial'],
    requiredFields: ['corporation_name', 'secretary_name', 'resolution_date', 'resolution_content'],
  },
  {
    id: 'special-power-of-attorney',
    name: 'Special Power of Attorney',
    description: 'Authorization granted by the principal to agent to perform specific legal acts on their behalf.',
    category: 'Authorization',
    icon: '🔑',
    color: 'bg-orange-50 border-orange-200 hover:border-orange-400',
    iconBg: 'bg-orange-100 text-orange-700',
    caseTypes: ['Civil', 'Commercial'],
    requiredFields: ['principal_name', 'agent_name', 'specific_authority', 'principal_id'],
  },
  {
    id: 'deed-of-sale',
    name: 'Deed of Absolute Sale',
    description: 'Instrument of conveyance transferring absolute ownership of real or personal property.',
    category: 'Deed',
    icon: '🏠',
    color: 'bg-green-50 border-green-200 hover:border-green-400',
    iconBg: 'bg-green-100 text-green-700',
    caseTypes: ['Civil', 'Commercial'],
    requiredFields: ['seller_name', 'buyer_name', 'property_description', 'purchase_price', 'tax_declaration_no'],
  },
]

// ─── Category colors ───────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Pleading:      'bg-blue-100 text-blue-700',
  Motion:        'bg-purple-100 text-purple-700',
  Affidavit:     'bg-indigo-100 text-indigo-700',
  Letter:        'bg-gray-100 text-gray-700',
  Contract:      'bg-teal-100 text-teal-700',
  Certificate:   'bg-yellow-100 text-yellow-700',
  Authorization: 'bg-orange-100 text-orange-700',
  Deed:          'bg-green-100 text-green-700',
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface TemplateSelectorProps {
  onSelect: (templateId: string) => void
  onClose: () => void
}

export function TemplateSelector({ onSelect, onClose }: TemplateSelectorProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  const categories = ['ALL', ...Array.from(new Set(PHILIPPINE_TEMPLATES.map(t => t.category)))]

  const filtered = PHILIPPINE_TEMPLATES.filter(t => {
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'ALL' || t.category === categoryFilter
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="flex items-center gap-3 bg-navy-950 text-white rounded-xl p-4">
        <span className="text-2xl">⚖️</span>
        <div>
          <p className="font-semibold text-sm">Philippine Legal Templates</p>
          <p className="text-xs text-blue-200">
            Pre-formatted templates compliant with the Rules of Court, A.M. circulars, and Philippine substantive laws.
            Auto-populates from case and client data.
          </p>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3">
        <Input
          placeholder="Search templates…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 text-sm"
        />
        <div className="flex gap-1 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-navy-950 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
        {filtered.map(template => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`text-left border rounded-xl p-4 transition-all duration-200 hover:shadow-md ${template.color}`}
          >
            <div className="flex items-start gap-3">
              <span className={`text-2xl p-2 rounded-lg shrink-0 ${template.iconBg}`}>
                {template.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-semibold text-navy-950 text-sm leading-snug">{template.name}</p>
                  <span className={`shrink-0 text-xs rounded-full px-2 py-0.5 font-medium ${CATEGORY_COLORS[template.category] ?? 'bg-gray-100 text-gray-700'}`}>
                    {template.category}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{template.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.caseTypes.map(ct => (
                    <span key={ct} className="text-xs bg-white/80 text-gray-500 rounded px-1.5 py-0.5 border border-gray-200">
                      {ct}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 py-12 text-center">
            <span className="text-3xl">🔍</span>
            <p className="text-sm text-gray-500 mt-2">No templates found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
