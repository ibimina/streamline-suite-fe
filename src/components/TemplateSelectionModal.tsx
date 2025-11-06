'use client'
import React, { useState } from 'react'
import { Template, AccentColor } from '../types'
import { XIcon } from './Icons'

interface TemplateSelectionModalProps {
  onContinue: (template: Template, color: AccentColor) => void
  onClose: () => void
}

const templates: { name: Template; label: string }[] = [
  { name: 'classic', label: 'Classic' },
  { name: 'modern', label: 'Modern' },
  { name: 'minimalist', label: 'Minimalist' },
  { name: 'corporate', label: 'Corporate' },
  { name: 'creative', label: 'Creative' },
]

const colors: { name: AccentColor; label: string; class: string }[] = [
  { name: 'teal', label: 'Teal', class: 'bg-teal-500' },
  { name: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { name: 'crimson', label: 'Crimson', class: 'bg-red-600' },
  { name: 'slate', label: 'Slate', class: 'bg-slate-600' },
]

export const TemplateSelectionModal: React.FC<TemplateSelectionModalProps> = ({
  onContinue,
  onClose,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>('classic')
  const [selectedColor, setSelectedColor] = useState<AccentColor>('teal')

  const accentColorClass = colors.find(c => c.name === selectedColor)?.class || 'bg-teal-500'

  const TemplatePreview: React.FC<{ template: { name: Template; label: string } }> = ({
    template,
  }) => (
    <div
      key={template.name}
      onClick={() => setSelectedTemplate(template.name)}
      className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${selectedTemplate === template.name ? 'border-teal-500 shadow-lg' : 'border-gray-300 dark:border-gray-600'}`}
    >
      <h3 className='font-semibold text-md mb-2 text-center'>{template.label}</h3>
      <div className='h-40 bg-gray-50 dark:bg-gray-700 rounded-md p-2 flex overflow-hidden text-[4px] leading-tight'>
        {template.name === 'classic' && (
          <div className='w-full flex flex-col'>
            <div className='flex justify-between items-start'>
              <div className='w-1/3 h-4 bg-gray-300 dark:bg-gray-500'></div>
              <div className={`h-4 w-1/3 ${accentColorClass}`}></div>
            </div>
            <div className='h-2 w-1/4 mt-4 bg-gray-200 dark:bg-gray-600'></div>
            <div className='h-1 w-1/2 mt-1 bg-gray-200 dark:bg-gray-600'></div>
            <div className={`h-2.5 w-full mt-auto ${accentColorClass}`}></div>
          </div>
        )}
        {template.name === 'modern' && (
          <div className='w-full flex flex-col'>
            <div
              className={`h-8 w-full ${accentColorClass} rounded-t-sm flex items-center px-2 justify-between`}
            >
              <div className='w-1/4 h-2 bg-white/50'></div>
              <div className='w-1/4 h-2 bg-white/50'></div>
            </div>
            <div className='h-2 w-1/4 mt-4 bg-gray-200 dark:bg-gray-600'></div>
            <div className='h-1 w-1/2 mt-1 bg-gray-200 dark:bg-gray-600'></div>
            <div className={`h-2.5 w-full mt-auto bg-gray-300 dark:bg-gray-500`}></div>
          </div>
        )}
        {template.name === 'minimalist' && (
          <div className='w-full flex flex-col p-1'>
            <div className='flex justify-between items-start'>
              <div className='w-1/3 h-2 bg-gray-300 dark:bg-gray-500'></div>
              <div className={`h-2 w-1/3`} style={{ backgroundColor: accentColorClass }}></div>
            </div>
            <div className='w-full h-px my-3 bg-gray-200 dark:bg-gray-600'></div>
            <div className='h-1 w-1/4 bg-gray-200 dark:bg-gray-600'></div>
            <div className='h-1 w-1/2 mt-1 bg-gray-200 dark:bg-gray-600'></div>
            <div className='w-full h-px mt-auto mb-1 bg-gray-200 dark:bg-gray-600'></div>
          </div>
        )}
        {template.name === 'corporate' && (
          <div className='w-full flex'>
            <div className={`w-1/3 h-full ${accentColorClass}`}></div>
            <div className='w-2/3 flex flex-col pl-2'>
              <div className='h-3 w-full bg-gray-300 dark:bg-gray-500'></div>
              <div className='h-2 w-1/4 mt-4 bg-gray-200 dark:bg-gray-600'></div>
              <div className='h-1 w-1/2 mt-1 bg-gray-200 dark:bg-gray-600'></div>
              <div className={`h-2.5 w-full mt-auto bg-gray-300 dark:bg-gray-500`}></div>
            </div>
          </div>
        )}
        {template.name === 'creative' && (
          <div className='w-full flex flex-col relative'>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-4 bg-gray-200 dark:bg-gray-600 opacity-50 transform -rotate-45'></div>
            <div className='flex justify-between items-start'>
              <div className='w-1/3 h-4 bg-gray-300 dark:bg-gray-500'></div>
              <div className={`h-4 w-1/3 ${accentColorClass}`}></div>
            </div>
            <div className='h-2 w-1/4 mt-4 bg-gray-200 dark:bg-gray-600'></div>
            <div className='h-1 w-1/2 mt-1 bg-gray-200 dark:bg-gray-600'></div>
            <div className={`h-2.5 w-full mt-auto ${accentColorClass}`}></div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>Choose a Template</h2>
          <button onClick={onClose}>
            <XIcon className='w-6 h-6' />
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
          {templates.map(template => (
            <TemplatePreview key={template.name} template={template} />
          ))}
        </div>

        <div className='mt-6'>
          <h3 className='font-semibold text-lg mb-3'>Select Accent Color</h3>
          <div className='flex space-x-4'>
            {colors.map(color => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-8 h-8 rounded-full ${color.class} transition-transform transform hover:scale-110 ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-teal-500 dark:ring-offset-gray-800' : ''}`}
              >
                <span className='sr-only'>{color.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className='flex justify-end mt-8'>
          <button onClick={onClose} className='mr-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-600'>
            Cancel
          </button>
          <button
            onClick={() => onContinue(selectedTemplate, selectedColor)}
            className='px-6 py-2 rounded bg-teal-500 text-white font-semibold hover:bg-teal-600'
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
