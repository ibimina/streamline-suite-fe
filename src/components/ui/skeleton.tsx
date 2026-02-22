import * as React from 'react'
import { cn } from '@/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'text' | 'rectangular'
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-muted',
          {
            'rounded-md': variant === 'default' || variant === 'rectangular',
            'rounded-full': variant === 'circular',
            'rounded h-4': variant === 'text',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Skeleton.displayName = 'Skeleton'

// Preset skeleton components for common use cases
const SkeletonText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { lines?: number }
>(({ className, lines = 1, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }, (_, i) => i).map(id => (
        <Skeleton
          key={`text-line-${id}`}
          variant='text'
          className={cn('h-4', id === lines - 1 && lines > 1 && 'w-3/4')}
        />
      ))}
    </div>
  )
})
SkeletonText.displayName = 'SkeletonText'

const SkeletonAvatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { size?: 'sm' | 'md' | 'lg' }
>(({ className, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }
  return (
    <Skeleton
      ref={ref}
      variant='circular'
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  )
})
SkeletonAvatar.displayName = 'SkeletonAvatar'

const SkeletonCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('rounded-xl border border-border bg-card p-6 space-y-4', className)}
        {...props}
      >
        <div className='flex items-center space-x-4'>
          <SkeletonAvatar />
          <div className='space-y-2 flex-1'>
            <Skeleton className='h-4 w-1/4' />
            <Skeleton className='h-3 w-1/3' />
          </div>
        </div>
        <SkeletonText lines={3} />
      </div>
    )
  }
)
SkeletonCard.displayName = 'SkeletonCard'

const SkeletonTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { rows?: number; columns?: number }
>(({ className, rows = 5, columns = 4, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('w-full space-y-3', className)} {...props}>
      {/* Header */}
      <div className='flex gap-4 pb-2 border-b border-border'>
        {Array.from({ length: columns }, (_, i) => `header-col-${i}`).map(id => (
          <Skeleton key={id} className='h-4 flex-1' />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }, (_, i) => `row-${i}`).map(rowId => (
        <div key={rowId} className='flex gap-4 py-2'>
          {Array.from({ length: columns }, (_, i) => `${rowId}-col-${i}`).map(cellId => (
            <Skeleton key={cellId} className='h-4 flex-1' />
          ))}
        </div>
      ))}
    </div>
  )
})
SkeletonTable.displayName = 'SkeletonTable'

const SkeletonButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { size?: 'sm' | 'md' | 'lg' }
>(({ className, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-11 w-32',
  }
  return (
    <Skeleton ref={ref} className={cn('rounded-md', sizeClasses[size], className)} {...props} />
  )
})
SkeletonButton.displayName = 'SkeletonButton'

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonTable, SkeletonButton }
