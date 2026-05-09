'use client'

// Quanby Legal Platform – Contract Uploader Component
// Drag-and-drop file upload with validation and preview

import { useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ContractUploaderProps {
  onFileSelect: (file: File) => void
  onFileRemove?: () => void
  selectedFile?: File | null
  disabled?: boolean
  className?: string
}

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
}
const MAX_SIZE_MB = 50

function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType === 'application/pdf') {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
        <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    )
  }
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
      <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
  )
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ContractUploader({ onFileSelect, onFileRemove, selectedFile, disabled, className }: ContractUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateAndSet = useCallback((file: File) => {
    setError(null)
    const accepted = Object.keys(ACCEPTED_TYPES)
    if (!accepted.includes(file.type) && !file.name.match(/\.(pdf|docx|doc)$/i)) {
      setError('Unsupported file type. Please upload PDF, DOCX, or DOC files.')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`)
      return
    }
    onFileSelect(file)
  }, [onFileSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    const file = e.dataTransfer.files[0]
    if (file) validateAndSet(file)
  }, [disabled, validateAndSet])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }, [disabled])

  const handleDragLeave = useCallback(() => setIsDragging(false), [])

  const handleClick = () => {
    if (!disabled && !selectedFile) inputRef.current?.click()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) validateAndSet(file)
  }

  return (
    <div className={cn('w-full', className)}>
      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={cn(
            'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-200',
            isDragging
              ? 'border-blue-500 bg-blue-50 scale-[1.01]'
              : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/40',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {/* Animated pulse ring when dragging */}
          {isDragging && (
            <div className="absolute inset-0 rounded-2xl border-2 border-blue-500 animate-ping opacity-20" />
          )}

          {/* Upload icon */}
          <div className={cn(
            'mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors',
            isDragging ? 'bg-blue-500' : 'bg-navy-950/5'
          )}>
            <svg className={cn('h-8 w-8', isDragging ? 'text-white' : 'text-navy-950')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <p className="text-lg font-semibold text-navy-950 mb-1">
            {isDragging ? 'Drop your contract here' : 'Drag & drop your contract'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            or <span className="text-blue-600 font-medium">click to browse</span>
          </p>

          {/* Supported formats */}
          <div className="flex items-center gap-2">
            {['PDF', 'DOCX', 'DOC'].map(fmt => (
              <span key={fmt} className="rounded-md bg-white border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600 shadow-sm">
                {fmt}
              </span>
            ))}
            <span className="text-xs text-gray-400">up to {MAX_SIZE_MB}MB</span>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />
        </div>
      ) : (
        /* File preview */
        <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
          <FileIcon mimeType={selectedFile.type} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-navy-950 truncate">{selectedFile.name}</p>
            <p className="text-sm text-gray-500">{formatBytes(selectedFile.size)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-green-700 font-medium bg-green-100 px-2 py-1 rounded-full">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Ready
            </span>
            {onFileRemove && (
              <button
                type="button"
                onClick={onFileRemove}
                className="rounded-lg p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
          <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
