'use client'

import * as React from 'react'
import { CalendarIcon, ChevronDown } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { cn } from '@/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

export type DatePreset =
  | 'today'
  | 'last7days'
  | 'last30days'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisYear'
  | 'custom'

export interface DateFilterProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  className?: string
}

const presets: { label: string; value: DatePreset; getValue: () => DateRange }[] = [
  {
    label: 'Today',
    value: 'today',
    getValue: () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      return { from: today, to: end }
    },
  },
  {
    label: 'Last 7 days',
    value: 'last7days',
    getValue: () => {
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      const from = new Date()
      from.setDate(from.getDate() - 6)
      from.setHours(0, 0, 0, 0)
      return { from, to: today }
    },
  },
  {
    label: 'Last 30 days',
    value: 'last30days',
    getValue: () => {
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      const from = new Date()
      from.setDate(from.getDate() - 29)
      from.setHours(0, 0, 0, 0)
      return { from, to: today }
    },
  },
  {
    label: 'This month',
    value: 'thisMonth',
    getValue: () => {
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      const from = new Date(today.getFullYear(), today.getMonth(), 1)
      return { from, to: today }
    },
  },
  {
    label: 'Last month',
    value: 'lastMonth',
    getValue: () => {
      const today = new Date()
      const from = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const to = new Date(today.getFullYear(), today.getMonth(), 0)
      to.setHours(23, 59, 59, 999)
      return { from, to }
    },
  },
  {
    label: 'This year',
    value: 'thisYear',
    getValue: () => {
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      const from = new Date(today.getFullYear(), 0, 1)
      return { from, to: today }
    },
  },
]

// Check if a date range matches a preset
function getMatchingPreset(range: DateRange | undefined): DatePreset | null {
  if (!range?.from || !range?.to) return null

  const fromTime = new Date(range.from).setHours(0, 0, 0, 0)
  const toTime = new Date(range.to).setHours(0, 0, 0, 0)

  for (const preset of presets) {
    const presetRange = preset.getValue()
    if (!presetRange.from || !presetRange.to) continue
    const presetFromTime = new Date(presetRange.from).setHours(0, 0, 0, 0)
    const presetToTime = new Date(presetRange.to).setHours(0, 0, 0, 0)

    if (fromTime === presetFromTime && toTime === presetToTime) {
      return preset.value
    }
  }
  return 'custom'
}

// Format date for input value (YYYY-MM-DD)
function formatDateForInput(date: Date | undefined): string {
  if (!date) return ''
  return date.toISOString().split('T')[0]
}

// Parse date from input value
function parseDateFromInput(value: string): Date | undefined {
  if (!value) return undefined
  const date = new Date(value)
  if (isNaN(date.getTime())) return undefined
  return date
}

export function DateFilter({ value, onChange, className }: DateFilterProps) {
  const [isPresetOpen, setIsPresetOpen] = React.useState(false)
  const [showCustomInputs, setShowCustomInputs] = React.useState(false)

  const currentPreset = React.useMemo(() => getMatchingPreset(value), [value])

  const presetLabel = React.useMemo(() => {
    if (!value?.from) return 'All time'
    if (currentPreset && currentPreset !== 'custom') {
      const preset = presets.find(p => p.value === currentPreset)
      return preset?.label || 'All time'
    }
    return 'Custom'
  }, [value, currentPreset])

  // Show custom inputs if current value is a custom range
  React.useEffect(() => {
    if (currentPreset === 'custom') {
      setShowCustomInputs(true)
    }
  }, [currentPreset])

  const handlePresetSelect = (preset: (typeof presets)[0] | null) => {
    if (preset) {
      onChange?.(preset.getValue())
      setShowCustomInputs(false)
    } else {
      onChange?.(undefined)
      setShowCustomInputs(false)
    }
    setIsPresetOpen(false)
  }

  const handleCustomClick = () => {
    setShowCustomInputs(true)
    setIsPresetOpen(false)
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const from = parseDateFromInput(e.target.value)
    if (from) {
      from.setHours(0, 0, 0, 0)
      onChange?.({ from, to: value?.to })
    }
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const to = parseDateFromInput(e.target.value)
    if (to) {
      to.setHours(23, 59, 59, 999)
      onChange?.({ from: value?.from, to })
    }
  }

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {/* Preset Dropdown */}
      <Popover open={isPresetOpen} onOpenChange={setIsPresetOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='h-9 gap-1.5 border-border bg-background hover:bg-muted'
          >
            <CalendarIcon className='h-4 w-4 text-muted-foreground' />
            <span className='font-medium'>{presetLabel}</span>
            <ChevronDown className='h-3.5 w-3.5 text-muted-foreground' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-44 p-1' align='start'>
          <div className='space-y-0.5'>
            <button
              onClick={() => handlePresetSelect(null)}
              className={cn(
                'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
                !value?.from ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
              )}
            >
              All time
            </button>
            {presets.map(preset => (
              <button
                key={preset.value}
                onClick={() => handlePresetSelect(preset)}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
                  currentPreset === preset.value
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-muted'
                )}
              >
                {preset.label}
              </button>
            ))}
            <div className='border-t border-border my-1' />
            <button
              onClick={handleCustomClick}
              className={cn(
                'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
                showCustomInputs && currentPreset === 'custom'
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-muted'
              )}
            >
              Custom range
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Custom Date Inputs */}
      {showCustomInputs && (
        <div className='flex items-center gap-2'>
          <Input
            type='date'
            value={formatDateForInput(value?.from)}
            onChange={handleStartDateChange}
            className='h-9 w-36'
          />
          <span className='text-muted-foreground text-sm'>to</span>
          <Input
            type='date'
            value={formatDateForInput(value?.to)}
            onChange={handleEndDateChange}
            className='h-9 w-36'
          />
        </div>
      )}
    </div>
  )
}

// Keep the old export for backwards compatibility
export { DateFilter as DateRangePicker }
export type { DateFilterProps as DateRangePickerProps }
