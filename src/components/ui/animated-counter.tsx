'use client'

// Quanby Case Management Platform – Animated Counter Component
// Counts from 0 to target value over ~1 second using requestAnimationFrame

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedCounterProps {
  value: number
  duration?: number        // ms, default 1000
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

export function AnimatedCounter({
  value,
  duration = 1000,
  className,
  prefix = '',
  suffix = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const frameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const startValueRef = useRef(0)

  useEffect(() => {
    // Easing: ease-out cubic
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

    const animate = (now: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = now
      }

      const elapsed = now - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOut(progress)

      const current = startValueRef.current + (value - startValueRef.current) * easedProgress
      setDisplayValue(current)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
      }
    }

    // Cancel any existing animation
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
    }
    startTimeRef.current = null
    startValueRef.current = 0

    // Small delay to ensure component is mounted before animating
    const timeout = setTimeout(() => {
      frameRef.current = requestAnimationFrame(animate)
    }, 50)

    return () => {
      clearTimeout(timeout)
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration])

  const formatted = displayValue.toFixed(decimals)

  return (
    <span className={cn('tabular-nums', className)}>
      {prefix}{formatted}{suffix}
    </span>
  )
}
