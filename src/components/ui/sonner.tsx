'use client'

// Quanby Case Management Platform – Sonner Toaster Wrapper
// Navy-themed toast notifications using the sonner library

import { Toaster as SonnerToaster } from 'sonner'

interface ToasterProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

export function Toaster({ position = 'top-right' }: ToasterProps) {
  return (
    <SonnerToaster
      position={position}
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        classNames: {
          toast:
            'font-sans text-sm rounded-xl border shadow-lg',
          success:
            'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100',
          error:
            'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
          warning:
            'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100',
          info:
            'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100',
          description: 'text-xs opacity-70',
          actionButton:
            'bg-navy-950 text-white text-xs rounded-lg px-2 py-1 hover:bg-navy-800 transition-colors',
          cancelButton:
            'bg-gray-100 text-gray-700 text-xs rounded-lg px-2 py-1 hover:bg-gray-200 transition-colors',
        },
      }}
    />
  )
}

// Re-export toast for convenience
export { toast } from 'sonner'
