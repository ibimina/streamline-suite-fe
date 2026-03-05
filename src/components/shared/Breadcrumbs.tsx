'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  /** Override auto-generated breadcrumbs */
  items?: BreadcrumbItem[]
  /** Custom label mappings for path segments */
  labelMap?: Record<string, string>
  /** Show home icon as first item */
  showHome?: boolean
  className?: string
}

// Default label mappings for common routes
const defaultLabelMap: Record<string, string> = {
  dashboard: 'Dashboard',
  invoices: 'Invoices',
  quotations: 'Quotations',
  inventory: 'Inventory',
  expenses: 'Expenses',
  analytics: 'Analytics',
  staff: 'Staff',
  payroll: 'Payroll',
  taxes: 'Taxes',
  admin: 'Admin',
  settings: 'Settings',
  suppliers: 'Suppliers',
  products: 'Products',
  customers: 'Customers',
  create: 'Create',
  edit: 'Edit',
  view: 'View',
  new: 'New',
}

/**
 * Breadcrumbs component for dashboard navigation.
 * Auto-generates breadcrumbs from URL path or accepts custom items.
 */
export function Breadcrumbs({
  items,
  labelMap = {},
  showHome = true,
  className,
}: BreadcrumbsProps) {
  const pathname = usePathname()

  // Merge default and custom label mappings
  const labels = React.useMemo(() => ({ ...defaultLabelMap, ...labelMap }), [labelMap])

  // Generate breadcrumbs from pathname if items not provided
  const breadcrumbs = React.useMemo(() => {
    if (items) return items

    const segments = pathname.split('/').filter(Boolean)
    const generatedItems: BreadcrumbItem[] = []

    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`

      // Skip dynamic segments like IDs (UUIDs or MongoDB ObjectIds)
      const isId = /^[a-f0-9]{24}$|^[0-9a-f-]{36}$/i.test(segment)

      if (isId) {
        // Replace ID with contextual label
        const prevSegment = segments[index - 1]
        if (prevSegment === 'edit') {
          // Skip - already handled by 'edit'
          return
        }
        generatedItems.push({
          label: `#${segment.slice(0, 8)}...`,
          href: currentPath,
        })
      } else {
        generatedItems.push({
          label: labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
          href: index < segments.length - 1 ? currentPath : undefined,
        })
      }
    })

    return generatedItems
  }, [items, pathname, labels])

  // Don't render if only home or empty
  if (breadcrumbs.length === 0) return null

  return (
    <nav aria-label='Breadcrumb' className={cn('flex items-center text-sm', className)}>
      <ol className='flex items-center gap-1.5'>
        {showHome && (
          <li className='flex items-center'>
            <Link
              href='/dashboard'
              className='text-muted-foreground hover:text-foreground transition-colors'
              aria-label='Home'
            >
              <Home className='h-4 w-4' />
            </Link>
            {breadcrumbs.length > 0 && (
              <ChevronRight className='h-4 w-4 mx-1.5 text-muted-foreground' />
            )}
          </li>
        )}

        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <li key={item.label} className='flex items-center'>
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(isLast ? 'text-foreground font-medium' : 'text-muted-foreground')}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && <ChevronRight className='h-4 w-4 mx-1.5 text-muted-foreground' />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
