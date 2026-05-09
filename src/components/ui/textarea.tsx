// Quanby Legal Platform – Textarea Component (shadcn/ui pattern)

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-slate-50 dark:ring-offset-slate-950 dark:placeholder:text-slate-500',
          error
            ? 'border-red-500 focus-visible:ring-red-500 dark:border-red-500'
            : 'border-slate-300 focus-visible:ring-blue-500 dark:border-slate-700 dark:focus-visible:ring-blue-400',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
