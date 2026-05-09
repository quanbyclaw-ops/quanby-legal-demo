'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface PieChartSegment {
  label: string
  value: number
  color: string
}

interface PieChartProps {
  data: PieChartSegment[]
  size?: number
  thickness?: number   // donut hole radius as fraction of size/2
  centerLabel?: string
  centerValue?: string | number
  className?: string
  showLegend?: boolean
  title?: string
}

export function PieChart({
  data,
  size = 180,
  thickness = 0.55,
  centerLabel,
  centerValue,
  className,
  showLegend = true,
  title,
}: PieChartProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  const total = data.reduce((s, d) => s + d.value, 0)
  const cx = size / 2
  const cy = size / 2
  const r = (size / 2) * 0.85
  const innerR = r * thickness

  // Build SVG arc segments
  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  function arcPath(startAngle: number, endAngle: number, outerR: number, innerRad: number) {
    const s1 = polarToCartesian(cx, cy, outerR, startAngle)
    const e1 = polarToCartesian(cx, cy, outerR, endAngle)
    const s2 = polarToCartesian(cx, cy, innerRad, endAngle)
    const e2 = polarToCartesian(cx, cy, innerRad, startAngle)
    const large = endAngle - startAngle > 180 ? 1 : 0
    return [
      `M ${s1.x} ${s1.y}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${e1.x} ${e1.y}`,
      `L ${s2.x} ${s2.y}`,
      `A ${innerRad} ${innerRad} 0 ${large} 0 ${e2.x} ${e2.y}`,
      'Z',
    ].join(' ')
  }

  let currentAngle = 0
  const segments = data.map((item, idx) => {
    const sweep = total > 0 ? (item.value / total) * 360 : 0
    const start = currentAngle
    const end = currentAngle + sweep
    currentAngle = end
    return { ...item, start, end, idx }
  })

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {title && <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          {segments.map((seg) => {
            const isHov = hovered === seg.idx
            const scale = isHov ? 1.05 : 1
            return (
              <path
                key={seg.label}
                d={arcPath(seg.start, seg.end, r * scale, innerR * (1 / scale))}
                fill={seg.color}
                opacity={mounted ? (hovered !== null && !isHov ? 0.65 : 1) : 0}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHovered(seg.idx)}
                onMouseLeave={() => setHovered(null)}
                style={{ transition: 'opacity 0.3s, transform 0.2s' }}
              >
                <title>{`${seg.label}: ${seg.value} (${total > 0 ? Math.round((seg.value / total) * 100) : 0}%)`}</title>
              </path>
            )
          })}
        </svg>

        {/* Center label */}
        {(centerLabel || centerValue !== undefined) && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            {centerValue !== undefined && (
              <span className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {hovered !== null ? data[hovered].value : centerValue}
              </span>
            )}
            {centerLabel && (
              <span className="text-[10px] text-slate-500 dark:text-slate-400 text-center leading-tight px-2">
                {hovered !== null ? data[hovered].label : centerLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex w-full flex-wrap justify-center gap-x-4 gap-y-1.5">
          {data.map((item, idx) => (
            <div
              key={item.label}
              className={cn(
                'flex items-center gap-1.5 cursor-pointer transition-opacity',
                hovered !== null && hovered !== idx ? 'opacity-50' : 'opacity-100'
              )}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-slate-600 dark:text-slate-400">{item.label}</span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {total > 0 ? `${Math.round((item.value / total) * 100)}%` : '0%'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
