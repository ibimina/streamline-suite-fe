'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { DateRange, DayPicker } from 'react-day-picker'
import { cn } from '@/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  align?: 'start' | 'center' | 'end'
  className?: string
}

const presets = [
  {
    label: 'Today',
    getValue: () => {
      const today = new Date()
      return { from: today, to: today }
    },
  },
  {
    label: 'Last 7 days',
    getValue: () => {
      const today = new Date()
      const from = new Date(today)
      from.setDate(from.getDate() - 7)
      return { from, to: today }
    },
  },
  {
    label: 'Last 30 days',
    getValue: () => {
      const today = new Date()
      const from = new Date(today)
      from.setDate(from.getDate() - 30)
      return { from, to: today }
    },
  },
  {
    label: 'This month',
    getValue: () => {
      const today = new Date()
      const from = new Date(today.getFullYear(), today.getMonth(), 1)
      return { from, to: today }
    },
  },
  {
    label: 'Last month',
    getValue: () => {
      const today = new Date()
      const from = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const to = new Date(today.getFullYear(), today.getMonth(), 0)
      return { from, to }
    },
  },
  {
    label: 'This year',
    getValue: () => {
      const today = new Date()
      const from = new Date(today.getFullYear(), 0, 1)
      return { from, to: today }
    },
  },
]

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Select date range',
  align = 'start',
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handlePresetClick = (preset: (typeof presets)[0]) => {
    onChange?.(preset.getValue())
    setIsOpen(false)
  }

  const handleSelect = (range: DateRange | undefined) => {
    onChange?.(range)
    // Only close if both dates are selected
    if (range?.from && range?.to) {
      setIsOpen(false)
    }
  }

  const displayValue = React.useMemo(() => {
    if (!value?.from) return placeholder
    if (!value.to) return formatDate(value.from)
    return `${formatDate(value.from)} - ${formatDate(value.to)}`
  }, [value, placeholder])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'justify-start text-left font-normal min-w-60',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align={align}>
        <div className='flex'>
          {/* Presets sidebar */}
          <div className='border-r border-border p-2 space-y-1'>
            {presets.map(preset => (
              <button
                key={preset.label}
                onClick={() => handlePresetClick(preset)}
                className='w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-muted transition-colors'
              >
                {preset.label}
              </button>
            ))}
            {value && (
              <button
                onClick={() => {
                  onChange?.(undefined)
                  setIsOpen(false)
                }}
                className='w-full text-left px-3 py-1.5 text-sm rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
              >
                Clear
              </button>
            )}
          </div>
          {/* Calendar */}
          <div className='p-3'>
            <DayPicker
              mode='range'
              selected={value}
              onSelect={handleSelect}
              numberOfMonths={2}
              defaultMonth={value?.from || new Date()}
              showOutsideDays
              className='border-0'
              classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium',
                nav: 'space-x-1 flex items-center',
                nav_button:
                  'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-input',
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: cn(
                  'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
                  '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
                ),
                day: 'h-8 w-8 p-0 font-normal aria-selected:opacity-100 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground',
                day_range_start: 'day-range-start',
                day_range_end: 'day-range-end',
                day_selected:
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                day_today: 'bg-accent text-accent-foreground',
                day_outside:
                  'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
                day_disabled: 'text-muted-foreground opacity-50',
                day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                day_hidden: 'invisible',
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
