'use client'

import * as React from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { DateFilter } from '@/components/ui/date-filter'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterBarProps {
  // Search
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  showSearch?: boolean

  // Date Range
  dateRange?: DateRange
  onDateRangeChange?: (range: DateRange | undefined) => void
  showDateRange?: boolean

  // Status Filter
  statusValue?: string
  onStatusChange?: (value: string) => void
  statusOptions?: FilterOption[]
  statusPlaceholder?: string
  showStatus?: boolean

  // Additional Filter (optional secondary filter)
  secondaryValue?: string
  onSecondaryChange?: (value: string) => void
  secondaryOptions?: FilterOption[]
  secondaryPlaceholder?: string
  showSecondary?: boolean

  // Reset
  onReset?: () => void
  showReset?: boolean

  // Custom class
  className?: string
}

export function FilterBar({
  // Search props
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  showSearch = true,

  // Date range props
  dateRange,
  onDateRangeChange,
  showDateRange = true,

  // Status props
  statusValue = '',
  onStatusChange,
  statusOptions = [],
  statusPlaceholder = 'All Status',
  showStatus = true,

  // Secondary filter props
  secondaryValue = '',
  onSecondaryChange,
  secondaryOptions = [],
  secondaryPlaceholder = 'All',
  showSecondary = false,

  // Reset props
  onReset,
  showReset = true,

  // Styling
  className,
}: FilterBarProps) {
  const hasFilters = React.useMemo(() => {
    return (
      searchValue !== '' ||
      dateRange?.from !== undefined ||
      (statusValue !== '' && statusValue !== 'all') ||
      (secondaryValue !== '' && secondaryValue !== 'all')
    )
  }, [searchValue, dateRange, statusValue, secondaryValue])

  const handleReset = () => {
    onSearchChange?.('')
    onDateRangeChange?.(undefined)
    onStatusChange?.('all')
    onSecondaryChange?.('all')
    onReset?.()
  }

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap',
        className
      )}
    >
      {/* Search Input */}
      {showSearch && onSearchChange && (
        <div className='relative w-full sm:w-auto'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <input
            type='text'
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            className='w-full sm:w-50 pl-9 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm'
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
            >
              <X className='h-4 w-4' />
            </button>
          )}
        </div>
      )}

      {/* Date Range Picker */}
      {showDateRange && onDateRangeChange && (
        <DateFilter value={dateRange} onChange={onDateRangeChange} className='w-full sm:w-auto' />
      )}

      {/* Status Filter */}
      {showStatus && onStatusChange && statusOptions.length > 0 && (
        <Select value={statusValue || 'all'} onValueChange={onStatusChange}>
          <SelectTrigger className='w-full sm:w-40'>
            <SlidersHorizontal className='mr-2 h-4 w-4 text-muted-foreground' />
            <SelectValue placeholder={statusPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{statusPlaceholder}</SelectItem>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Secondary Filter */}
      {showSecondary && onSecondaryChange && secondaryOptions.length > 0 && (
        <Select value={secondaryValue || 'all'} onValueChange={onSecondaryChange}>
          <SelectTrigger className='w-full sm:w-40'>
            <SelectValue placeholder={secondaryPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{secondaryPlaceholder}</SelectItem>
            {secondaryOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Reset Button */}
      {showReset && hasFilters && (
        <Button variant='ghost' size='sm' onClick={handleReset} className='text-muted-foreground'>
          <X className='mr-1 h-4 w-4' />
          Clear filters
        </Button>
      )}
    </div>
  )
}

export default FilterBar
