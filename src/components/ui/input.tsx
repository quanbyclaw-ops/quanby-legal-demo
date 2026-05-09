// Quanby Legal Platform – Input Component (shadcn/ui pattern)

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, iconPosition = 'left', ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative flex items-center">
          {icon && iconPosition === 'left' && (
            <span className="pointer-events-none absolute left-3 flex items-center text-slate-400 dark:text-slate-500 [&_svg]:size-4">
              {icon}
            </span>
          )}
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:ring-offset-slate-950 dark:placeholder:text-slate-500',
              error
                ? 'border-red-500 focus-visible:ring-red-500 dark:border-red-500'
                : 'border-slate-300 focus-visible:ring-blue-500 dark:border-slate-700 dark:focus-visible:ring-blue-400',
              icon && iconPosition === 'left' && 'pl-9',
              icon && iconPosition === 'right' && 'pr-9',
              className
            )}
            ref={ref}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <span className="pointer-events-none absolute right-3 flex items-center text-slate-400 dark:text-slate-500 [&_svg]:size-4">
              {icon}
            </span>
          )}
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-slate-50 dark:ring-offset-slate-950 dark:placeholder:text-slate-500',
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
Input.displayName = 'Input'

export { Input }
