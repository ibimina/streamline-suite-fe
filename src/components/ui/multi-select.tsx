'use client'

import * as React from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '@/utils'

interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  maxCount?: number
}

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = 'Select items...',
      className,
      disabled,
      maxCount,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState('')

    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const selectedOptions = options.filter(option => value.includes(option.value))

    const toggleOption = (optionValue: string) => {
      if (disabled) return

      const newValue = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : maxCount && value.length >= maxCount
          ? value
          : [...value, optionValue]

      onValueChange(newValue)
    }

    const removeOption = (optionValue: string) => {
      if (disabled) return
      onValueChange(value.filter(v => v !== optionValue))
    }

    const clearAll = () => {
      if (disabled) return
      onValueChange([])
    }

    return (
      <>
        <div ref={ref} className={cn('relative', className)}>
          {/* Trigger */}
          <div
            className={cn(
              'flex min-h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring',
              disabled && 'cursor-not-allowed opacity-50',
              !disabled && 'cursor-pointer',
              className
            )}
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            <div className='flex items-center gap-1'>
              {/* {selectedOptions.length > 0 && (
                            <button
                                type="button"
                                className="h-4 w-4 rounded hover:bg-secondary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearAll();
                                }}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        )} */}
              <ChevronDown
                className={cn('h-4 w-4 opacity-50 transition-transform', isOpen && 'rotate-180')}
              />
            </div>
          </div>

          {/* Content */}
          {isOpen && (
            <div className='absolute bg-white top-full z-50 mt-1 w-full rounded-md border bg-popover p-0 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95'>
              {/* Search Input */}
              <div className='flex items-center border-b px-3'>
                <input
                  className='flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
                  placeholder='Search...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Options List */}
              <div className='max-h-60 overflow-auto bg-white'>
                {filteredOptions.length > 0 ? (
                  <div className='p-1'>
                    {filteredOptions.map(option => {
                      const isSelected = value.includes(option.value)
                      const isDisabledOption = maxCount && !isSelected && value.length >= maxCount

                      return (
                        <div
                          key={option.value}
                          className={cn(
                            'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                            isSelected && 'bg-accent text-accent-foreground',
                            !isSelected &&
                              !isDisabledOption &&
                              'hover:bg-accent hover:text-accent-foreground',
                            isDisabledOption && 'opacity-50 cursor-not-allowed'
                          )}
                          onClick={() => !isDisabledOption && toggleOption(option.value)}
                        >
                          <div className='flex h-4 w-4 items-center justify-center mr-2'>
                            {isSelected && <Check className='h-4 w-4' />}
                          </div>
                          <span>{option.label}</span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className='p-6 text-center text-sm text-muted-foreground'>
                    No options found
                  </div>
                )}
              </div>

              {/* Footer */}
              {maxCount && (
                <div className='border-t px-3 py-2 text-xs text-muted-foreground'>
                  {value.length} of {maxCount} selected
                </div>
              )}
            </div>
          )}
        </div>
        <div className='flex flex-1 flex-wrap gap-1'>
          {selectedOptions.length > 0 ? (
            selectedOptions.map(option => (
              <span
                key={option.value}
                className='inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground'
              >
                {option.label}
                <button
                  type='button'
                  className='ml-1 h-3 w-3 rounded-full hover:bg-secondary-foreground/20'
                  onClick={e => {
                    e.stopPropagation()
                    removeOption(option.value)
                  }}
                >
                  <X className='h-3 w-3' />
                </button>
              </span>
            ))
          ) : (
            <span className='text-muted-foreground'>{placeholder}</span>
          )}
        </div>
      </>
    )
  }
)

MultiSelect.displayName = 'MultiSelect'

export { MultiSelect }
export type { MultiSelectOption, MultiSelectProps }
