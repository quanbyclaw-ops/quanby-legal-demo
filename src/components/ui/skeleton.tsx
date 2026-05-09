'use client'

// Quanby Case Management Platform – Skeleton Shimmer Component
// Configurable shimmer placeholder for loading states

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none'
}

export function Skeleton({ className, width, height, rounded = 'md' }: SkeletonProps) {
  const roundedClass = {
    none: 'rounded-none',
    sm:   'rounded-sm',
    md:   'rounded-md',
    lg:   'rounded-lg',
    xl:   'rounded-xl',
    '2xl':'rounded-2xl',
    full: 'rounded-full',
  }[rounded]

  return (
    <div
      className={cn(
        'skeleton',
        roundedClass,
        className
      )}
      style={{
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }}
      aria-hidden="true"
    />
  )
}

// ─── Preset skeleton compositions ─────────────────────────────────────────────

export function SkeletonStatCard() {
  return (
    <div className="rounded-xl border border-gray-100 p-4 bg-white space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="w-10 h-10" rounded="lg" />
        <Skeleton className="w-12 h-5" rounded="full" />
      </div>
      <Skeleton className="w-16 h-8" rounded="md" />
      <Skeleton className="w-24 h-3" rounded="md" />
    </div>
  )
}

// Deterministic widths for skeleton rows (avoids hydration mismatch)
const SKELETON_WIDTHS = [70, 85, 60, 75, 65, 80, 55, 90, 70, 65]

export function SkeletonTableRow({ cols = 6 }: { cols?: number }) {
  return (
    <tr className="border-b border-gray-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton
            className="h-4"
            style={{ width: `${SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}%` } as React.CSSProperties}
            rounded="md"
          />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonContractCard() {
  return (
    <div className="px-6 py-4 border-b border-gray-100">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 hidden sm:block flex-shrink-0" rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" rounded="md" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" rounded="full" />
            <Skeleton className="h-5 w-20" rounded="full" />
          </div>
          <div className="flex gap-4 mt-1">
            <Skeleton className="h-3 w-48" rounded="md" />
            <Skeleton className="h-3 w-24" rounded="md" />
          </div>
        </div>
        <div className="space-y-1 text-right flex-shrink-0">
          <Skeleton className="h-5 w-20" rounded="md" />
          <Skeleton className="h-3 w-16" rounded="md" />
        </div>
      </div>
    </div>
  )
}
