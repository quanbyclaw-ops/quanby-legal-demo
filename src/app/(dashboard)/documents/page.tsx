'use client'

// Quanby Legal Platform – Document Management Hub (Prompt 6)
// Full-featured document management: upload, generate, filter, preview

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ComplianceBadge } from '@/components/layout/ComplianceBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DocumentUpload } from '@/components/documents/DocumentUpload'
import { TemplateSelector } from '@/components/documents/TemplateSelector'
import { TemplateEditor } from '@/components/documents/TemplateEditor'

// ─── Mock data for demo ────────────────────────────────────────────────────────

const MOCK_DOCUMENTS = [
  {
    id: '1',
    title: 'Verified Complaint – Santos v. Reyes',
    type: 'PLEADING',
    status: 'FILED',
    fileName: 'complaint-santos-reyes.pdf',
    fileSize: 245678,
    mimeType: 'application/pdf',
    createdAt: '2025-03-10T08:00:00Z',
    case: { caseNumber: 'CV-2025-0042', title: 'Santos v. Reyes' },
    isNotarized: true,
  },
  {
    id: '2',
    title: 'Judicial Affidavit – Witness Maria Cruz',
    type: 'AFFIDAVIT',
    status: 'REVIEW',
    fileName: 'judicial-affidavit-cruz.pdf',
    fileSize: 189234,
    mimeType: 'application/pdf',
    createdAt: '2025-03-12T10:30:00Z',
    case: { caseNumber: 'CV-2025-0042', title: 'Santos v. Reyes' },
    isNotarized: false,
  },
  {
    id: '3',
    title: 'Motion to Dismiss – Labor Case 001',
    type: 'MOTION',
    status: 'DRAFT',
    fileName: 'motion-dismiss-labor001.docx',
    fileSize: 78900,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    createdAt: '2025-03-14T14:00:00Z',
    case: { caseNumber: 'NLRC-2025-0018', title: 'Dela Cruz v. ABC Corp.' },
    isNotarized: false,
  },
  {
    id: '4',
    title: 'RTC Order – Branch 45 Quezon City',
    type: 'ORDER',
    status: 'APPROVED',
    fileName: 'rtc-order-branch45.pdf',
    fileSize: 134500,
    mimeType: 'application/pdf',
    createdAt: '2025-03-15T09:00:00Z',
    case: { caseNumber: 'CV-2025-0042', title: 'Santos v. Reyes' },
    isNotarized: false,
  },
  {
    id: '5',
    title: 'Special Power of Attorney – Juan dela Cruz',
    type: 'CERTIFICATE',
    status: 'APPROVED',
    fileName: 'spa-delacruz.pdf',
    fileSize: 98765,
    mimeType: 'application/pdf',
    createdAt: '2025-03-16T11:00:00Z',
    case: null,
    isNotarized: true,
  },
  {
    id: '6',
    title: 'Demand Letter – Unpaid Wages',
    type: 'CORRESPONDENCE',
    status: 'FILED',
    fileName: 'demand-letter-wages.pdf',
    fileSize: 67890,
    mimeType: 'application/pdf',
    createdAt: '2025-03-17T13:00:00Z',
    case: { caseNumber: 'NLRC-2025-0018', title: 'Dela Cruz v. ABC Corp.' },
    isNotarized: false,
  },
  {
    id: '7',
    title: 'Contract of Sale – Lot 4 Block 7',
    type: 'CONTRACT',
    status: 'DRAFT',
    fileName: 'contract-sale-lot4.pdf',
    fileSize: 312000,
    mimeType: 'application/pdf',
    createdAt: '2025-03-18T08:30:00Z',
    case: null,
    isNotarized: false,
  },
  {
    id: '8',
    title: 'Decision – People v. Mendoza',
    type: 'DECISION',
    status: 'ARCHIVED',
    fileName: 'decision-mendoza.pdf',
    fileSize: 450000,
    mimeType: 'application/pdf',
    createdAt: '2025-02-20T16:00:00Z',
    case: { caseNumber: 'CR-2024-0011', title: 'People v. Mendoza' },
    isNotarized: false,
  },
]

// ─── Type configs ──────────────────────────────────────────────────────────────

const DOC_TYPE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  PLEADING:       { label: 'Pleading',       color: 'bg-blue-100 text-blue-800',    icon: '📄' },
  MOTION:         { label: 'Motion',         color: 'bg-purple-100 text-purple-800', icon: '⚖️' },
  ORDER:          { label: 'Order',          color: 'bg-amber-100 text-amber-800',   icon: '🏛️' },
  DECISION:       { label: 'Decision',       color: 'bg-red-100 text-red-800',       icon: '⚖️' },
  EVIDENCE:       { label: 'Evidence',       color: 'bg-green-100 text-green-800',   icon: '🔍' },
  CONTRACT:       { label: 'Contract',       color: 'bg-teal-100 text-teal-800',     icon: '📋' },
  AFFIDAVIT:      { label: 'Affidavit',      color: 'bg-indigo-100 text-indigo-800', icon: '✍️' },
  CERTIFICATE:    { label: 'Certificate',    color: 'bg-yellow-100 text-yellow-800', icon: '🏅' },
  CORRESPONDENCE: { label: 'Correspondence', color: 'bg-gray-100 text-gray-800',     icon: '✉️' },
  OTHER:          { label: 'Other',          color: 'bg-slate-100 text-slate-800',   icon: '📁' },
  COMPLAINT:      { label: 'Complaint',      color: 'bg-orange-100 text-orange-800', icon: '📝' },
  ANSWER:         { label: 'Answer',         color: 'bg-cyan-100 text-cyan-800',     icon: '💬' },
}

const DOC_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DRAFT:    { label: 'Draft',    color: 'bg-gray-100 text-gray-700' },
  REVIEW:   { label: 'Review',   color: 'bg-yellow-100 text-yellow-700' },
  APPROVED: { label: 'Approved', color: 'bg-green-100 text-green-700' },
  FILED:    { label: 'Filed',    color: 'bg-blue-100 text-blue-700' },
  SERVED:   { label: 'Served',   color: 'bg-purple-100 text-purple-700' },
  ARCHIVED: { label: 'Archived', color: 'bg-slate-100 text-slate-500' },
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function getFileIcon(mimeType: string): string {
  if (mimeType === 'application/pdf') return '📕'
  if (mimeType.includes('word')) return '📘'
  if (mimeType.includes('image')) return '🖼️'
  return '📄'
}

// ─── Document Card ─────────────────────────────────────────────────────────────

function DocumentCard({
  doc,
  selected,
  onSelect,
  onPreview,
}: {
  doc: typeof MOCK_DOCUMENTS[0]
  selected: boolean
  onSelect: (id: string) => void
  onPreview: (doc: typeof MOCK_DOCUMENTS[0]) => void
}) {
  const typeConfig = DOC_TYPE_CONFIG[doc.type] ?? DOC_TYPE_CONFIG.OTHER
  const statusConfig = DOC_STATUS_CONFIG[doc.status] ?? DOC_STATUS_CONFIG.DRAFT

  return (
    <div
      className={`relative bg-white rounded-xl border transition-all duration-200 hover:shadow-md ${
        selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      {/* Selection checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(doc.id)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer"
          aria-label={`Select ${doc.title}`}
        />
      </div>

      {/* Notarized badge */}
      {doc.isNotarized && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-300">
            🏅 Notarized
          </span>
        </div>
      )}

      <div className="p-4 pt-8">
        {/* File icon + type */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{getFileIcon(doc.mimeType)}</span>
          <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${typeConfig.color}`}>
            {typeConfig.icon} {typeConfig.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-navy-950 text-sm leading-snug mb-1 line-clamp-2">
          {doc.title}
        </h3>

        {/* Filename */}
        <p className="text-xs text-gray-400 mb-2 truncate">{doc.fileName}</p>

        {/* Meta */}
        <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
          <span>{formatFileSize(doc.fileSize)}</span>
          <span>{new Date(doc.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>

        {/* Case */}
        {doc.case && (
          <div className="text-xs text-blue-700 bg-blue-50 rounded-md px-2 py-1 mb-2 truncate">
            📁 {doc.case.caseNumber} – {doc.case.title}
          </div>
        )}

        {/* Status + actions */}
        <div className="flex items-center justify-between mt-3">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => onPreview(doc)}
              className="text-xs text-gray-500 hover:text-navy-950 hover:bg-gray-100 rounded px-2 py-1 transition-colors"
              title="Preview document"
            >
              👁️ View
            </button>
            <button
              className="text-xs text-gray-500 hover:text-navy-950 hover:bg-gray-100 rounded px-2 py-1 transition-colors"
              title="Download document"
            >
              ⬇️
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Document List Row ─────────────────────────────────────────────────────────

function DocumentListRow({
  doc,
  selected,
  onSelect,
  onPreview,
}: {
  doc: typeof MOCK_DOCUMENTS[0]
  selected: boolean
  onSelect: (id: string) => void
  onPreview: (doc: typeof MOCK_DOCUMENTS[0]) => void
}) {
  const typeConfig = DOC_TYPE_CONFIG[doc.type] ?? DOC_TYPE_CONFIG.OTHER
  const statusConfig = DOC_STATUS_CONFIG[doc.status] ?? DOC_STATUS_CONFIG.DRAFT

  return (
    <tr className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${selected ? 'bg-blue-50' : ''}`}>
      <td className="px-4 py-3 w-8">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(doc.id)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getFileIcon(doc.mimeType)}</span>
          <div>
            <p className="text-sm font-medium text-navy-950">{doc.title}</p>
            <p className="text-xs text-gray-400">{doc.fileName} · {formatFileSize(doc.fileSize)}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${typeConfig.color}`}>
          {typeConfig.icon} {typeConfig.label}
        </span>
      </td>
      <td className="px-4 py-3">
        {doc.case ? (
          <span className="text-xs text-blue-700">{doc.case.caseNumber}</span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-gray-500">
        {new Date(doc.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          {doc.isNotarized && <span className="text-xs text-amber-600">🏅</span>}
          <button onClick={() => onPreview(doc)} className="text-xs text-gray-500 hover:text-navy-950 px-2 py-1 hover:bg-gray-100 rounded">👁️</button>
          <button className="text-xs text-gray-500 hover:text-navy-950 px-2 py-1 hover:bg-gray-100 rounded">⬇️</button>
        </div>
      </td>
    </tr>
  )
}

// ─── Preview Modal ─────────────────────────────────────────────────────────────

function DocumentPreviewModal({
  doc,
  open,
  onClose,
}: {
  doc: typeof MOCK_DOCUMENTS[0] | null
  open: boolean
  onClose: () => void
}) {
  if (!doc) return null
  const typeConfig = DOC_TYPE_CONFIG[doc.type] ?? DOC_TYPE_CONFIG.OTHER

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{getFileIcon(doc.mimeType)}</span>
            <span className="truncate">{doc.title}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Type:</span>
              <span className={`ml-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${typeConfig.color}`}>
                {typeConfig.icon} {typeConfig.label}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${(DOC_STATUS_CONFIG[doc.status] ?? DOC_STATUS_CONFIG.DRAFT).color}`}>
                {(DOC_STATUS_CONFIG[doc.status] ?? DOC_STATUS_CONFIG.DRAFT).label}
              </span>
            </div>
            <div>
              <span className="text-gray-500">File:</span>
              <span className="ml-2 text-navy-950">{doc.fileName}</span>
            </div>
            <div>
              <span className="text-gray-500">Size:</span>
              <span className="ml-2 text-navy-950">{formatFileSize(doc.fileSize)}</span>
            </div>
            <div>
              <span className="text-gray-500">Uploaded:</span>
              <span className="ml-2 text-navy-950">{new Date(doc.createdAt).toLocaleDateString('en-PH', { dateStyle: 'long' })}</span>
            </div>
            {doc.case && (
              <div>
                <span className="text-gray-500">Case:</span>
                <span className="ml-2 text-blue-700">{doc.case.caseNumber}</span>
              </div>
            )}
          </div>

          {/* PDF Preview Placeholder */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">📕</span>
            <p className="text-sm font-medium text-gray-600">{doc.fileName}</p>
            <p className="text-xs text-gray-400">PDF viewer — document stored in secure cloud storage</p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline">
                ⬇️ Download
              </Button>
              {!doc.isNotarized && (
                <Button size="sm" variant="outline" asChild>
                  <Link href="/notarization">🏅 Request Notarization</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Notarization status */}
          {doc.isNotarized && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <span className="text-xl">🏅</span>
              <div>
                <p className="text-sm font-semibold text-amber-800">Notarized Document</p>
                <p className="text-xs text-amber-600">This document has been electronically notarized and carries a valid digital seal.</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showUpload, setShowUpload] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [previewDoc, setPreviewDoc] = useState<typeof MOCK_DOCUMENTS[0] | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Filter documents
  const filtered = MOCK_DOCUMENTS.filter(doc => {
    const matchSearch =
      !search ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(search.toLowerCase()) ||
      (doc.case?.caseNumber ?? '').toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'ALL' || doc.type === typeFilter
    const matchStatus = statusFilter === 'ALL' || doc.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(d => d.id)))
    }
  }

  const handlePreview = (doc: typeof MOCK_DOCUMENTS[0]) => {
    setPreviewDoc(doc)
    setShowPreview(true)
  }

  return (
    <div className="space-y-6">
      {/* ─── Page header ─── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Document Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload, generate, and manage all case documents and pleadings
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <ComplianceBadge standard="SC-RULES" variant="compact" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplates(true)}
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            📋 Generate from Template
          </Button>
          <Button
            size="sm"
            onClick={() => setShowUpload(true)}
            className="bg-navy-950 hover:bg-navy-800 text-white"
          >
            ⬆️ Upload Document
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <Link href="/dashboard" className="hover:text-navy-950">Dashboard</Link>
        <span className="mx-2">/</span>
        <span className="text-navy-950 font-medium">Documents</span>
      </nav>

      {/* ─── Stats strip ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Documents', value: MOCK_DOCUMENTS.length, icon: '📁', color: 'text-navy-950' },
          { label: 'Filed', value: MOCK_DOCUMENTS.filter(d => d.status === 'FILED').length, icon: '✅', color: 'text-green-700' },
          { label: 'Pending Review', value: MOCK_DOCUMENTS.filter(d => d.status === 'REVIEW' || d.status === 'DRAFT').length, icon: '🔄', color: 'text-amber-700' },
          { label: 'Notarized', value: MOCK_DOCUMENTS.filter(d => d.isNotarized).length, icon: '🏅', color: 'text-amber-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs font-medium">{stat.label}</span>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ─── Filters + View Toggle ─── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search documents, filenames, case numbers…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Type filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 text-sm">
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              {Object.entries(DOC_TYPE_CONFIG).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.icon} {val.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {Object.entries(DOC_STATUS_CONFIG).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View toggle */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm transition-colors ${viewMode === 'grid' ? 'bg-navy-950 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              title="Grid view"
            >
              ▦
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm transition-colors ${viewMode === 'list' ? 'bg-navy-950 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              title="List view"
            >
              ≡
            </button>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedIds.size > 0 && (
          <div className="mt-3 flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2">
            <span className="text-sm font-medium text-blue-800">{selectedIds.size} selected</span>
            <Button size="sm" variant="outline" className="text-xs border-blue-300 text-blue-700">
              ⬇️ Bulk Download
            </Button>
            <Button size="sm" variant="outline" className="text-xs border-red-300 text-red-600 hover:bg-red-50">
              🗑️ Delete Selected
            </Button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="ml-auto text-xs text-gray-500 hover:text-gray-700"
            >
              ✕ Clear
            </button>
          </div>
        )}
      </div>

      {/* ─── Results count ─── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-navy-950">{filtered.length}</span> of {MOCK_DOCUMENTS.length} documents
        </p>
        {viewMode === 'list' && (
          <label className="text-sm text-gray-500 flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIds.size === filtered.length && filtered.length > 0}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            Select all
          </label>
        )}
      </div>

      {/* ─── Document Grid ─── */}
      {viewMode === 'grid' ? (
        filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(doc => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                selected={selectedIds.has(doc.id)}
                onSelect={toggleSelect}
                onPreview={handlePreview}
              />
            ))}
          </div>
        ) : (
          <EmptyState onUpload={() => setShowUpload(true)} onTemplate={() => setShowTemplates(true)} />
        )
      ) : (
        /* ─── Document List ─── */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 w-8">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === filtered.length && filtered.length > 0}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Document</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Case</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(doc => (
                    <DocumentListRow
                      key={doc.id}
                      doc={doc}
                      selected={selectedIds.has(doc.id)}
                      onSelect={toggleSelect}
                      onPreview={handlePreview}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <EmptyState onUpload={() => setShowUpload(true)} onTemplate={() => setShowTemplates(true)} />
            </div>
          )}
        </div>
      )}

      {/* ─── Upload Dialog ─── */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <DocumentUpload onClose={() => setShowUpload(false)} />
        </DialogContent>
      </Dialog>

      {/* ─── Template Selector Dialog ─── */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate from Philippine Legal Template</DialogTitle>
          </DialogHeader>
          {selectedTemplate ? (
            <TemplateEditor
              templateId={selectedTemplate}
              onBack={() => setSelectedTemplate(null)}
              onClose={() => { setShowTemplates(false); setSelectedTemplate(null) }}
            />
          ) : (
            <TemplateSelector
              onSelect={(id) => setSelectedTemplate(id)}
              onClose={() => setShowTemplates(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Preview Modal ─── */}
      <DocumentPreviewModal
        doc={previewDoc}
        open={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  )
}

function EmptyState({
  onUpload,
  onTemplate,
}: {
  onUpload: () => void
  onTemplate: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <span className="text-5xl">📂</span>
      <h3 className="text-lg font-semibold text-navy-950">No documents found</h3>
      <p className="text-sm text-gray-500 text-center max-w-xs">
        Upload a document or generate one from a Philippine legal template to get started.
      </p>
      <div className="flex gap-2">
        <Button size="sm" onClick={onUpload} className="bg-navy-950 text-white">
          ⬆️ Upload Document
        </Button>
        <Button size="sm" variant="outline" onClick={onTemplate}>
          📋 Use Template
        </Button>
      </div>
    </div>
  )
}
