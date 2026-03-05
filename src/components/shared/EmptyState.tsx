import * as React from 'react'
import { cn } from '@/utils'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Users,
  Package,
  DollarSign,
  ClipboardList,
  Search,
  Inbox,
  type LucideIcon,
} from 'lucide-react'

// Preset illustrations for common empty states
const emptyStateIcons: Record<string, LucideIcon> = {
  invoices: FileText,
  customers: Users,
  products: Package,
  expenses: DollarSign,
  quotations: ClipboardList,
  search: Search,
  default: Inbox,
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon | keyof typeof emptyStateIcons
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  actionVariant?: 'default' | 'outline' | 'secondary'
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      icon = 'default',
      title,
      description,
      actionLabel,
      onAction,
      actionVariant = 'default',
      children,
      ...props
    },
    ref
  ) => {
    // Resolve the icon - either a LucideIcon component or a preset key
    const Icon = typeof icon === 'string' ? emptyStateIcons[icon] || emptyStateIcons.default : icon

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-12 px-4 text-center',
          className
        )}
        {...props}
      >
        {/* Icon container with subtle background */}
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4'>
          <Icon className='h-8 w-8 text-muted-foreground' aria-hidden='true' />
        </div>

        {/* Title */}
        <h3 className='text-lg font-semibold text-foreground mb-1'>{title}</h3>

        {/* Description */}
        {description && (
          <p className='text-sm text-muted-foreground max-w-sm mb-6'>{description}</p>
        )}

        {/* Action button */}
        {actionLabel && onAction && (
          <Button variant={actionVariant} onClick={onAction}>
            {actionLabel}
          </Button>
        )}

        {/* Custom content slot */}
        {children}
      </div>
    )
  }
)
EmptyState.displayName = 'EmptyState'

// Preset empty states for common use cases
interface PresetEmptyStateProps extends Omit<EmptyStateProps, 'icon' | 'title' | 'description'> {
  onAction?: () => void
}

const EmptyInvoices: React.FC<PresetEmptyStateProps> = props => (
  <EmptyState
    icon='invoices'
    title='No invoices yet'
    description='Create your first invoice to start tracking your business transactions.'
    actionLabel='Create Invoice'
    {...props}
  />
)

const EmptyCustomers: React.FC<PresetEmptyStateProps> = props => (
  <EmptyState
    icon='customers'
    title='No customers yet'
    description='Add your first customer to begin managing your client relationships.'
    actionLabel='Add Customer'
    {...props}
  />
)

const EmptyProducts: React.FC<PresetEmptyStateProps> = props => (
  <EmptyState
    icon='products'
    title='No products yet'
    description='Add products to your inventory to include them in invoices and quotations.'
    actionLabel='Add Product'
    {...props}
  />
)

const EmptySearch: React.FC<PresetEmptyStateProps> = props => (
  <EmptyState
    icon='search'
    title='No results found'
    description="Try adjusting your search or filter criteria to find what you're looking for."
    {...props}
  />
)

export { EmptyState, EmptyInvoices, EmptyCustomers, EmptyProducts, EmptySearch, emptyStateIcons }
