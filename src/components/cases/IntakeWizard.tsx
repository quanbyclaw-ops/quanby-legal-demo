'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

export interface WizardStep {
  id: number
  label: string
  description?: string
}

interface IntakeWizardProps {
  steps: WizardStep[]
  currentStep: number
  children: React.ReactNode
  className?: string
}

export function IntakeWizard({ steps, currentStep, children, className }: IntakeWizardProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Step progress indicator */}
      <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
        <div className="flex items-center justify-between relative">
          {/* Connecting line */}
          <div
            className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0"
            style={{ left: '2rem', right: '2rem' }}
          />
          {/* Filled progress line */}
          <div
            className="absolute top-5 h-0.5 bg-blue-600 z-0 transition-all duration-500"
            style={{
              left: '2rem',
              width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 1rem)`,
            }}
          />

          {steps.map((step) => {
            const isDone = step.id < currentStep
            const isActive = step.id === currentStep
            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-all duration-300',
                    isDone
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : isActive
                      ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-100'
                      : 'bg-white border-gray-300 text-gray-400'
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      'text-xs font-medium leading-tight',
                      isActive ? 'text-blue-700' : isDone ? 'text-slate-700' : 'text-gray-400'
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-400 hidden sm:block leading-tight mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
        {children}
      </div>
    </div>
  )
}
