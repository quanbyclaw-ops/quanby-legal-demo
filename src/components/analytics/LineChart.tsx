'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface LineChartDataPoint {
  label: string
  value: number
}

interface LineChartProps {
  data: LineChartDataPoint[]
  height?: number
  color?: string
  fillColor?: string
  showGrid?: boolean
  showDots?: boolean
  showArea?: boolean
  className?: string
  title?: string
  yLabel?: string
}

export function LineChart({
  data,
  height = 160,
  color = '#2563eb',
  fillColor,
  showGrid = true,
  showDots = true,
  showArea = true,
  className,
  title,
  yLabel,
}: LineChartProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)
  const [mounted, setMounted] = React.useState(false)
  const [pathLength, setPathLength] = React.useState(0)
  const pathRef = React.useRef<SVGPathElement>(null)

  const svgId = React.useId().replace(/:/g, '')

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  React.useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
  }, [data])

  if (data.length === 0) return null

  const padding = { top: 16, right: 16, bottom: 32, left: 40 }
  const width = 480
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom

  const minVal = Math.min(...data.map((d) => d.value))
  const maxVal = Math.max(...data.map((d) => d.value))
  const range = maxVal - minVal || 1

  function xPos(idx: number) {
    return padding.left + (idx / (data.length - 1)) * innerW
  }
  function yPos(val: number) {
    return padding.top + innerH - ((val - minVal) / range) * innerH
  }

  // Smooth bezier path
  function buildPath(pts: { x: number; y: number }[]) {
    if (pts.length < 2) return `M ${pts[0].x} ${pts[0].y}`
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) / 2
      const cp2x = pts[i].x + (pts[i + 1].x - pts[i].x) / 2
      d += ` C ${cp1x} ${pts[i].y} ${cp2x} ${pts[i + 1].y} ${pts[i + 1].x} ${pts[i + 1].y}`
    }
    return d
  }

  const points = data.map((d, i) => ({ x: xPos(i), y: yPos(d.value) }))
  const linePath = buildPath(points)
  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${padding.top + innerH} L ${points[0].x} ${padding.top + innerH} Z`

  const gradId = `line-grad-${svgId}`
  const fill = fillColor ?? color + '33'

  // Grid lines
  const gridLines = 4
  const gridValues = Array.from({ length: gridLines + 1 }, (_, i) => {
    const val = minVal + (i / gridLines) * range
    return { val: Math.round(val), y: yPos(val) }
  })

  return (
    <div className={cn('w-full', className)}>
      {title && <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
        style={{ height }}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {showGrid &&
          gridValues.map(({ val, y }, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + innerW}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeWidth={1}
                className="text-slate-900 dark:text-white"
              />
              <text
                x={padding.left - 6}
                y={y + 4}
                fontSize={9}
                textAnchor="end"
                fill="currentColor"
                fillOpacity={0.4}
                className="text-slate-600 dark:text-slate-400"
              >
                {val}
              </text>
            </g>
          ))}

        {/* X axis labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={xPos(i)}
            y={padding.top + innerH + 18}
            fontSize={9}
            textAnchor="middle"
            fill="currentColor"
            fillOpacity={0.5}
            className="text-slate-600 dark:text-slate-400"
          >
            {d.label}
          </text>
        ))}

        {/* Area fill */}
        {showArea && (
          <path d={areaPath} fill={`url(#${gradId})`} />
        )}

        {/* Line */}
        <path
          ref={pathRef}
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength || 9999}
          strokeDashoffset={mounted ? 0 : (pathLength || 9999)}
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />

        {/* Dots & hover */}
        {showDots &&
          points.map((pt, i) => (
            <g key={i} onMouseEnter={() => setHovered(i)}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hovered === i ? 6 : 4}
                fill={hovered === i ? color : 'white'}
                stroke={color}
                strokeWidth={2}
                className="transition-all duration-150"
                opacity={mounted ? 1 : 0}
                style={{ transition: 'opacity 0.5s, r 0.1s' }}
              />
              {hovered === i && (
                <g>
                  <rect
                    x={pt.x - 24}
                    y={pt.y - 32}
                    width={48}
                    height={22}
                    rx={4}
                    fill="#1e293b"
                    opacity={0.9}
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 16}
                    fontSize={10}
                    textAnchor="middle"
                    fill="white"
                    fontWeight="600"
                  >
                    {data[i].value}
                  </text>
                </g>
              )}
            </g>
          ))}
      </svg>
    </div>
  )
}
