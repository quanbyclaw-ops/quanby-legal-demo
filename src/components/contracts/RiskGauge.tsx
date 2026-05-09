'use client'

// Quanby Case Management Platform – Risk Gauge Component
// Circular SVG gauge displaying contract risk scores with mount animation

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface RiskGaugeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showLabel?: boolean
  animated?: boolean
}

const SIZE_CONFIG = {
  sm: { dim: 80,  stroke: 8,  fontSize: 18, labelSize: 9 },
  md: { dim: 120, stroke: 10, fontSize: 26, labelSize: 11 },
  lg: { dim: 180, stroke: 14, fontSize: 40, labelSize: 13 },
}

function getRiskColor(score: number): { stroke: string; text: string; label: string; bg: string } {
  if (score < 30)  return { stroke: '#22c55e', text: 'text-green-600',  label: 'Low Risk',      bg: 'bg-green-50' }
  if (score < 60)  return { stroke: '#eab308', text: 'text-yellow-600', label: 'Medium Risk',   bg: 'bg-yellow-50' }
  if (score < 80)  return { stroke: '#f97316', text: 'text-orange-600', label: 'High Risk',     bg: 'bg-orange-50' }
  return               { stroke: '#ef4444', text: 'text-red-600',    label: 'Critical Risk', bg: 'bg-red-50' }
}

export function RiskGauge({ score, size = 'md', className, showLabel = true, animated = true }: RiskGaugeProps) {
  const cfg = SIZE_CONFIG[size]
  const { stroke: strokeColor, text: textClass, label, bg } = getRiskColor(score)

  const radius = (cfg.dim - cfg.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clampedScore = Math.max(0, Math.min(100, score))
  const targetOffset = circumference - (clampedScore / 100) * circumference
  const cx = cfg.dim / 2
  const cy = cfg.dim / 2

  // Animate from full offset (empty) to target offset on mount
  const [currentOffset, setCurrentOffset] = useState(circumference)
  useEffect(() => {
    if (!animated) {
      setCurrentOffset(targetOffset)
      return
    }
    // Defer to next frame so the initial state renders first, enabling CSS transition
    const raf = requestAnimationFrame(() => {
      setCurrentOffset(targetOffset)
    })
    return () => cancelAnimationFrame(raf)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score])

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className={cn('rounded-full flex items-center justify-center', bg, 'p-2')}>
        <svg width={cfg.dim} height={cfg.dim} className="rotate-[-90deg]">
          {/* Background track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={cfg.stroke}
          />
          {/* Score arc – animates from 0 to target over 1.5s */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={cfg.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={currentOffset}
            style={animated ? { transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' } : undefined}
          />
          {/* Center text – needs counter-rotation */}
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={cfg.fontSize}
            fontWeight="700"
            fill={strokeColor}
            className="rotate-90 origin-center"
            style={{ transform: `rotate(90deg)`, transformOrigin: `${cx}px ${cy}px` }}
          >
            {clampedScore}
          </text>
        </svg>
      </div>
      {showLabel && (
        <span className={cn('font-semibold text-center', textClass, size === 'lg' ? 'text-base' : 'text-xs')}>
          {label}
        </span>
      )}
    </div>
  )
}
