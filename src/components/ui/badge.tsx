// Quanby Case Management Platform – Badge Component (shadcn/ui pattern)

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-blue-700 text-white hover:bg-blue-800',
        secondary:
          'border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300',
        destructive:
          'border-transparent bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400',
        outline:
          'border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300',
        success:
          'border-transparent bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400',
        warning:
          'border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
        info:
          'border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
        navy:
          'border-transparent bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-700',
        gold:
          'border-transparent bg-amber-500 text-slate-900 hover:bg-amber-600',
        // Case status variants
        active:
          'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        pending:
          'border-transparent bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        closed:
          'border-transparent bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
        // Priority variants
        critical:
          'border-transparent bg-red-600 text-white',
        high:
          'border-transparent bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        medium:
          'border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        low:
          'border-transparent bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-px text-[10px]',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
