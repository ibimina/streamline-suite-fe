import * as React from 'react'

import { cn } from '@/utils'

export interface InputProps extends React.ComponentProps<'input'> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all duration-200',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
          error &&
            'border-destructive ring-2 ring-destructive/20 focus-visible:border-destructive focus-visible:ring-destructive/20',
          className
        )}
        ref={ref}
        aria-invalid={error || undefined}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
