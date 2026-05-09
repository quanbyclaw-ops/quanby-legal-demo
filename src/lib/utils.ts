// Quanby Legal Platform – Utility Functions

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isAfter, isBefore, addDays, differenceInDays } from 'date-fns'
import { DATE_FORMATS, RISK_THRESHOLDS, getRiskLevel } from './constants'

// ─── Tailwind CSS ──────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Date Utilities ────────────────────────────────────────────────────────────

export function formatDate(date: Date | string | null | undefined, fmt: string = DATE_FORMATS.DISPLAY): string {
  if (!date) return '—'
  try {
    return format(new Date(date), fmt)
  } catch {
    return '—'
  }
}

export function formatLegalDate(date: Date | string | null | undefined): string {
  return formatDate(date, DATE_FORMATS.LEGAL)
}

export function formatRelativeDate(date: Date | string | null | undefined): string {
  if (!date) return '—'
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch {
    return '—'
  }
}

export function isDeadlineOverdue(date: Date | string | null | undefined): boolean {
  if (!date) return false
  return isBefore(new Date(date), new Date())
}

export function isDeadlineApproaching(date: Date | string | null | undefined, daysThreshold = 14): boolean {
  if (!date) return false
  const deadline = new Date(date)
  const threshold = addDays(new Date(), daysThreshold)
  return isAfter(deadline, new Date()) && isBefore(deadline, threshold)
}

export function daysUntilDeadline(date: Date | string | null | undefined): number | null {
  if (!date) return null
  return differenceInDays(new Date(date), new Date())
}

export function getDeadlineStatus(date: Date | string | null | undefined): {
  status: 'overdue' | 'critical' | 'approaching' | 'normal' | 'none'
  label: string
  colorClass: string
} {
  if (!date) return { status: 'none', label: 'No deadline', colorClass: 'text-gray-400' }

  const days = daysUntilDeadline(date)
  if (days === null) return { status: 'none', label: 'No deadline', colorClass: 'text-gray-400' }

  if (days < 0)  return { status: 'overdue',    label: `${Math.abs(days)}d overdue`, colorClass: 'text-red-600 font-semibold' }
  if (days <= 3) return { status: 'critical',   label: `${days}d left`,              colorClass: 'text-red-500 font-semibold' }
  if (days <= 14) return { status: 'approaching', label: `${days}d left`,            colorClass: 'text-orange-500' }
  return { status: 'normal', label: `${days}d left`, colorClass: 'text-gray-500' }
}

// ─── Case Number Generation ────────────────────────────────────────────────────

export function generateCaseNumber(type: string, year?: number): string {
  const y = year ?? new Date().getFullYear()
  const typeAbbrMap: Record<string, string> = {
    CIVIL: 'CIV',
    CRIMINAL: 'CRI',
    LABOR: 'LAB',
    ADMINISTRATIVE: 'ADM',
    FAMILY: 'FAM',
    COMMERCIAL: 'COM',
    SPECIAL_PROCEEDINGS: 'SPE',
    ELECTION: 'ELE',
    TAX: 'TAX',
    ENVIRONMENTAL: 'ENV',
  }
  const abbr = typeAbbrMap[type] ?? 'GEN'
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')
  return `QLP-${y}-${abbr}-${seq}`
}

// ─── Currency ─────────────────────────────────────────────────────────────────

export function formatCurrency(
  amount: number | null | undefined,
  currency = 'PHP',
  locale = 'en-PH'
): string {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatCompactCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '—'
  if (amount >= 1_000_000) return `₱${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `₱${(amount / 1_000).toFixed(0)}K`
  return `₱${amount.toLocaleString('en-PH')}`
}

// ─── File Utilities ────────────────────────────────────────────────────────────

export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() ?? ''
}

export function isImageFile(filename: string): boolean {
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(getFileExtension(filename))
}

export function isPdfFile(filename: string): boolean {
  return getFileExtension(filename) === 'pdf'
}

// ─── Risk Score ────────────────────────────────────────────────────────────────

export function getRiskColor(score: number): string {
  const level = getRiskLevel(score)
  const colorMap = {
    LOW: 'text-green-600',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-orange-600',
    CRITICAL: 'text-red-600',
  }
  return colorMap[level]
}

export function getRiskBadgeClass(score: number): string {
  return RISK_THRESHOLDS[getRiskLevel(score)].bgClass
}

// ─── Name Formatting ───────────────────────────────────────────────────────────

export function formatFullName(
  firstName: string,
  lastName: string,
  middleName?: string | null,
  suffix?: string | null
): string {
  const parts = [firstName, middleName, lastName, suffix].filter(Boolean)
  return parts.join(' ')
}

export function formatLawyerName(firstName: string, lastName: string): string {
  return `Atty. ${firstName} ${lastName}`
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

// ─── String Utilities ──────────────────────────────────────────────────────────

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength - 3)}...`
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())
}

// ─── Validation ────────────────────────────────────────────────────────────────

export function isValidPhilippineMobile(phone: string): boolean {
  return /^(\+63|0)(9\d{9})$/.test(phone.replace(/\s/g, ''))
}

export function isValidTIN(tin: string): boolean {
  return /^\d{3}-\d{3}-\d{3}(-\d{3})?$/.test(tin)
}

export function isValidBarNumber(barNumber: string): boolean {
  return /^\d{4}-\d{5}$/.test(barNumber)
}

// ─── API Response Helpers ──────────────────────────────────────────────────────

export function apiSuccess<T>(data: T, message?: string) {
  return { success: true, data, message }
}

export function apiError(message: string, code?: string, status = 400) {
  return { success: false, error: { message, code }, status }
}

// ─── PAO Eligibility Score ─────────────────────────────────────────────────────

export function calculatePaoEligibilityScore(params: {
  monthlyIncome: number
  isEmployed: boolean
  dependents: number
  assetValue?: number
}): number {
  const { monthlyIncome, isEmployed, dependents, assetValue = 0 } = params
  let score = 100

  // Income factor (lower income = higher score = more eligible)
  if (monthlyIncome > 50000) score -= 50
  else if (monthlyIncome > 30000) score -= 30
  else if (monthlyIncome > 18000) score -= 15
  else score -= 0

  // Employment factor
  if (!isEmployed) score += 10

  // Dependents (more dependents = more eligible)
  score += Math.min(dependents * 2, 10)

  // Assets
  if (assetValue > 5_000_000) score -= 30
  else if (assetValue > 1_000_000) score -= 15

  return Math.max(0, Math.min(100, score))
}
