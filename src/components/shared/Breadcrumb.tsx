'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items?: BreadcrumbItem[]
  showHome?: boolean
  homeHref?: string
  separator?: React.ReactNode
  maxItems?: number // Truncate if more items than this
}

// Generate breadcrumb items from pathname
const generateBreadcrumbsFromPath = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean)

  // Skip auth/dashboard route groups in display
  const filteredSegments = segments.filter(
    segment => !segment.startsWith('(') && !segment.endsWith(')')
  )

  return filteredSegments.map((segment, index) => {
    // Build the href for this segment
    const href = `/${filteredSegments.slice(0, index + 1).join('/')}`

    // Format the label: 'customer-details' -> 'Customer Details'
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    return {
      label,
      href: index === filteredSegments.length - 1 ? undefined : href, // Last item has no link
    }
  })
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      className,
      items,
      showHome = true,
      homeHref = '/dashboard',
      separator,
      maxItems = 4,
      ...props
    },
    ref
  ) => {
    const pathname = usePathname()

    // Use provided items or generate from pathname
    const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname)

    // Truncate if too many items
    const displayItems =
      breadcrumbItems.length > maxItems
        ? [breadcrumbItems[0], { label: '...', href: undefined }, ...breadcrumbItems.slice(-2)]
        : breadcrumbItems

    const SeparatorIcon = separator || (
      <ChevronRight className='h-4 w-4 text-muted-foreground shrink-0' />
    )

    return (
      <nav
        ref={ref}
        aria-label='Breadcrumb'
        className={cn('flex items-center text-sm', className)}
        {...props}
      >
        <ol className='flex items-center gap-1.5'>
          {/* Home link */}
          {showHome && (
            <>
              <li>
                <Link
                  href={homeHref}
                  className='flex items-center text-muted-foreground hover:text-foreground transition-colors'
                >
                  <Home className='h-4 w-4' />
                  <span className='sr-only'>Home</span>
                </Link>
              </li>
              {breadcrumbItems.length > 0 && <li className='flex items-center'>{SeparatorIcon}</li>}
            </>
          )}

          {/* Breadcrumb items */}
          {displayItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <li className='flex items-center'>
                {item.href ? (
                  <Link
                    href={item.href}
                    className='text-muted-foreground hover:text-foreground transition-colors truncate max-w-40'
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      'truncate max-w-52',
                      index === displayItems.length - 1
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground'
                    )}
                    aria-current={index === displayItems.length - 1 ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>

              {/* Separator (not after last item) */}
              {index < displayItems.length - 1 && (
                <li className='flex items-center'>{SeparatorIcon}</li>
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    )
  }
)
Breadcrumb.displayName = 'Breadcrumb'

export { Breadcrumb, generateBreadcrumbsFromPath }
