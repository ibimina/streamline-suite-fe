'use client'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils'

interface PaginatorProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Paginator({ currentPage, totalPages, onPageChange }: PaginatorProps) {
  // Generate page numbers to display with a sliding window
  const generatePagination = () => {
    const pagination: number[] = []

    // For small number of pages, show all pages
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pagination.push(i)
      }
      return pagination
    }

    // Create a sliding window of 3 pages
    let startPage = Math.max(1, currentPage - 1)
    const endPage = Math.min(startPage + 2, totalPages)

    // Adjust the window if we're at the end
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - 2)
    }

    // Generate the page numbers
    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i)
    }

    return pagination
  }

  const pages = generatePagination()

  return (
    <NavigationMenuPrimitive.Root className='relative flex justify-center'>
      <NavigationMenuPrimitive.List className='flex items-center gap-1 rounded-md bg-background p-1'>
        {/* Previous Button */}
        <NavigationMenuPrimitive.Item>
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              'flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
              'data-[active]:bg-accent/50'
            )}
            aria-label='Go to previous page'
          >
            <ChevronLeft className='h-4 w-4' />
            <span className='sr-only md:not-sr-only md:ml-2'>Previous</span>
          </button>
        </NavigationMenuPrimitive.Item>

        {/* Page Numbers */}
        {pages.map(page => (
          <NavigationMenuPrimitive.Item key={page}>
            <button
              onClick={() => onPageChange(page)}
              className={cn(
                'flex h-[31px] min-w-[31px] items-center justify-center rounded-[8px] px-3 text-xs font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                currentPage === page ? 'bg-[#0A3B83] text-white' : 'bg-[#E0E0E0] text-black'
              )}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          </NavigationMenuPrimitive.Item>
        ))}

        {/* Next Button */}
        <NavigationMenuPrimitive.Item>
          <button
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              'flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
              'data-[active]:bg-accent/50'
            )}
            aria-label='Go to next page'
          >
            <span className='sr-only md:not-sr-only md:mr-2'>Next</span>
            <ChevronRight className='h-4 w-4' />
          </button>
        </NavigationMenuPrimitive.Item>
      </NavigationMenuPrimitive.List>
    </NavigationMenuPrimitive.Root>
  )
}
