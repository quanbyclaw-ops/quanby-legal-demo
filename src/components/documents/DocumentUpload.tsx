'use client'

// Quanby Legal Platform – Document Upload Component
// Drag-and-drop multi-file upload with validation and case linking

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ─── Constants ─────────────────────────────────────────────────────────────────

const ACCEPTED_TYPES: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/msword': 'DOC',
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
}

const MAX_FILE_SIZE_MB = 20

const DOCUMENT_TYPES = [
  { value: 'PLEADING',       label: '📄 Pleading' },
  { value: 'MOTION',         label: '⚖️ Motion' },
  { value: 'ORDER',          label: '🏛️ Order' },
  { value: 'DECISION',       label: '⚖️ Decision' },
  { value: 'EVIDENCE',       label: '🔍 Evidence' },
  { value: 'CONTRACT',       label: '📋 Contract' },
  { value: 'AFFIDAVIT',      label: '✍️ Affidavit' },
  { value: 'CERTIFICATE',    label: '🏅 Certificate' },
  { value: 'CORRESPONDENCE', label: '✉️ Correspondence' },
  { value: 'OTHER',          label: '📁 Other' },
]

const MOCK_CASES = [
  { id: 'case-1', label: 'CV-2025-0042 – Santos v. Reyes' },
  { id: 'case-2', label: 'NLRC-2025-0018 – Dela Cruz v. ABC Corp.' },
  { id: 'case-3', label: 'CR-2024-0011 – People v. Mendoza' },
  { id: 'case-4', label: 'SP-2025-0003 – Estate of Bautista' },
]

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FileEntry {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'done' | 'error'
  error?: string
}

interface DocumentUploadProps {
  onClose: () => void
  onSuccess?: (fileNames: string[]) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function DocumentUpload({ onClose, onSuccess }: DocumentUploadProps) {
  const [files, setFiles] = useState<FileEntry[]>([])
  const [docType, setDocType] = useState('')
  const [caseId, setCaseId] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ─── File validation ───────────────────────────────────────────────────────

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES[file.type]) {
      return `Unsupported file type. Accepted: ${Object.values(ACCEPTED_TYPES).join(', ')}`
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File too large. Maximum size: ${MAX_FILE_SIZE_MB} MB`
    }
    return null
  }

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming)
    const entries: FileEntry[] = arr.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      progress: 0,
      status: validateFile(file) ? 'error' : 'pending',
      error: validateFile(file) ?? undefined,
    }))
    setFiles(prev => [...prev, ...entries])
  }, [])

  // ─── Drag handlers ─────────────────────────────────────────────────────────

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files)
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  // ─── Upload simulation ─────────────────────────────────────────────────────

  const handleUpload = async () => {
    if (!docType) return
    const valid = files.filter(f => f.status === 'pending')
    if (valid.length === 0) return

    setIsUploading(true)

    // Simulate upload progress for each file
    for (const entry of valid) {
      setFiles(prev =>
        prev.map(f => f.id === entry.id ? { ...f, status: 'uploading', progress: 0 } : f)
      )

      // Simulate incremental progress
      for (let pct = 10; pct <= 90; pct += 10) {
        await new Promise(r => setTimeout(r, 80))
        setFiles(prev =>
          prev.map(f => f.id === entry.id ? { ...f, progress: pct } : f)
        )
      }

      await new Promise(r => setTimeout(r, 200))

      setFiles(prev =>
        prev.map(f => f.id === entry.id ? { ...f, status: 'done', progress: 100 } : f)
      )
    }

    setIsUploading(false)
    onSuccess?.(valid.map(f => f.file.name))

    setTimeout(() => onClose(), 800)
  }

  const validFiles = files.filter(f => f.status !== 'error')
  const canUpload = validFiles.length > 0 && !!docType && !isUploading

  return (
    <div className="space-y-4">
      {/* ─── Drop zone ─── */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.01]'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <span className="text-4xl mb-3">📂</span>
        <p className="text-sm font-semibold text-navy-950 text-center">
          {isDragging ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-xs text-gray-500 mt-1">or click to browse</p>
        <div className="mt-3 flex flex-wrap gap-1 justify-center">
          {Object.values(ACCEPTED_TYPES).map(ext => (
            <span key={ext} className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-0.5 font-mono">
              .{ext.toLowerCase()}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Max {MAX_FILE_SIZE_MB} MB per file</p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
          multiple
          onChange={handleFileInput}
          onClick={e => e.stopPropagation()}
        />
      </div>

      {/* ─── File list ─── */}
      {files.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {files.map(entry => (
            <div
              key={entry.id}
              className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${
                entry.status === 'error' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
              }`}
            >
              <span className="text-lg shrink-0">
                {entry.status === 'done' ? '✅' : entry.status === 'error' ? '❌' : '📄'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-navy-950 truncate">{entry.file.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500">{formatFileSize(entry.file.size)}</p>
                  {entry.error && <p className="text-xs text-red-600">{entry.error}</p>}
                </div>
                {/* Progress bar */}
                {(entry.status === 'uploading' || entry.status === 'done') && (
                  <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${
                        entry.status === 'done' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${entry.progress}%` }}
                    />
                  </div>
                )}
              </div>
              {entry.status === 'pending' && (
                <button
                  onClick={() => removeFile(entry.id)}
                  className="text-gray-400 hover:text-red-500 shrink-0"
                  title="Remove"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ─── Metadata ─── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1 block">
            Document Type <span className="text-red-500">*</span>
          </label>
          <Select value={docType} onValueChange={setDocType}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select type…" />
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_TYPES.map(t => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1 block">
            Link to Case <span className="text-gray-400">(optional)</span>
          </label>
          <Select value={caseId} onValueChange={setCaseId}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select case…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No case link</SelectItem>
              {MOCK_CASES.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ─── Notice ─── */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
        <span>🔒</span>
        <span>
          Files are encrypted in transit and at rest. Document access is logged per{' '}
          <strong>RA 10173 (Data Privacy Act)</strong> requirements.
        </span>
      </div>

      {/* ─── Actions ─── */}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose} disabled={isUploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!canUpload}
          className="bg-navy-950 hover:bg-navy-800 text-white"
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span> Uploading…
            </span>
          ) : (
            `⬆️ Upload ${validFiles.length > 0 ? `(${validFiles.filter(f=>f.status==='pending').length})` : ''}`
          )}
        </Button>
      </div>
    </div>
  )
}
