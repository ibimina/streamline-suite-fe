import * as React from 'react'
import { cn } from '@/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Send,
  FileText,
  Loader2,
  type LucideIcon,
} from 'lucide-react'

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      status: {
        // Success states
        paid: 'bg-success-light text-success',
        complete: 'bg-success-light text-success',
        completed: 'bg-success-light text-success',
        active: 'bg-success-light text-success',
        approved: 'bg-success-light text-success',

        // Warning states
        pending: 'bg-warning-light text-warning',
        partial: 'bg-warning-light text-warning',
        review: 'bg-warning-light text-warning',

        // Error states
        overdue: 'bg-destructive-light text-destructive',
        failed: 'bg-destructive-light text-destructive',
        cancelled: 'bg-destructive-light text-destructive',
        rejected: 'bg-destructive-light text-destructive',
        unpaid: 'bg-destructive-light text-destructive',

        // Info states
        sent: 'bg-info-light text-info',
        processing: 'bg-info-light text-info',
        inProgress: 'bg-info-light text-info',

        // Neutral states
        draft: 'bg-muted text-muted-foreground',
        inactive: 'bg-muted text-muted-foreground',
        archived: 'bg-muted text-muted-foreground',
      },
    },
    defaultVariants: {
      status: 'draft',
    },
  }
)

// Map statuses to their icons
const statusIcons: Record<string, LucideIcon> = {
  // Success
  paid: CheckCircle2,
  complete: CheckCircle2,
  completed: CheckCircle2,
  active: CheckCircle2,
  approved: CheckCircle2,

  // Warning
  pending: Clock,
  partial: Clock,
  review: Clock,

  // Error
  overdue: AlertCircle,
  failed: XCircle,
  cancelled: XCircle,
  rejected: XCircle,
  unpaid: AlertCircle,

  // Info
  sent: Send,
  processing: Loader2,
  inProgress: Loader2,

  // Neutral
  draft: FileText,
  inactive: FileText,
  archived: FileText,
}

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof statusBadgeVariants> {
  showIcon?: boolean
  label?: string // Custom label text
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, showIcon = true, label, children, ...props }, ref) => {
    const statusKey = status || 'draft'
    const Icon = statusIcons[statusKey]
    const isAnimated = statusKey === 'processing' || statusKey === 'inProgress'

    // Format status text: 'inProgress' -> 'In Progress', 'paid' -> 'Paid'
    const formatStatusText = (s: string): string => {
      return s
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim()
    }

    const displayText = label || children || formatStatusText(statusKey)

    return (
      <span ref={ref} className={cn(statusBadgeVariants({ status }), className)} {...props}>
        {showIcon && Icon && (
          <Icon className={cn('h-3 w-3', isAnimated && 'animate-spin')} aria-hidden='true' />
        )}
        {displayText}
      </span>
    )
  }
)
StatusBadge.displayName = 'StatusBadge'

export { StatusBadge, statusBadgeVariants }
