'use client'
import React, { useState } from 'react'
import { Template, AccentColor, CustomTemplate } from '../types'
import { XIcon } from './Icons'
import TemplateUpload from './TemplateUpload'
import { useAppSelector } from '@/store/hooks'

interface TemplateSelectionModalProps {
  onContinue: (template: Template, color: AccentColor, customTemplate?: CustomTemplate) => void
  onClose: () => void
}

const templates: { name: Template; label: string }[] = [
  { name: 'classic', label: 'Classic' },
  { name: 'modern', label: 'Modern' },
  { name: 'minimalist', label: 'Minimalist' },
  { name: 'corporate', label: 'Corporate' },
  { name: 'creative', label: 'Creative' },
  { name: 'custom', label: 'Custom' },
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
  const [selectedCustomTemplate, setSelectedCustomTemplate] = useState<CustomTemplate | undefined>()
  const [showUploadModal, setShowUploadModal] = useState(false)

  const { details } = useAppSelector(state => state.company)
  const customTemplates = details?.customTemplates || []

  const accentColorClass = colors.find(c => c.name === selectedColor)?.class || 'bg-teal-500'

  const handleCustomTemplateUploaded = (template: CustomTemplate) => {
    // Template is already saved to Redux store by TemplateUpload component
    setShowUploadModal(false)
    setSelectedTemplate('custom')
    setSelectedCustomTemplate(template)

    // Show success notification
    alert(`Custom template "${template.name}" has been uploaded and is now available!`)
  }

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
    <div className='flex justify-center items-center z-50 p-4'>
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

        {/* Custom Templates Section */}
        <div className='mt-6'>
          <div className='flex justify-between items-center mb-3'>
            <h3 className='font-semibold text-lg'>Custom Templates</h3>
            <button
              onClick={() => setShowUploadModal(true)}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm'
            >
              Upload New Template
            </button>
          </div>

          {customTemplates.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              {customTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate('custom')
                    setSelectedCustomTemplate(template)
                  }}
                  className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
                    selectedTemplate === 'custom' && selectedCustomTemplate?.id === template.id
                      ? 'border-teal-500 shadow-lg'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <h4 className='font-semibold text-sm mb-2 text-center'>{template.name}</h4>
                  <div className='h-32 bg-gray-50 dark:bg-gray-700 rounded-md p-2 flex items-center justify-center'>
                    {template.thumbnailUrl ? (
                      <div className='w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500'>
                        Preview Available
                      </div>
                    ) : (
                      <div className='text-gray-400 text-xs text-center'>
                        <div className='w-8 h-8 mx-auto mb-1 bg-gray-300 rounded'></div>
                        Custom Template
                      </div>
                    )}
                  </div>
                  {template.description && (
                    <p className='text-xs text-gray-600 dark:text-gray-400 mt-2 text-center'>
                      {template.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center'>
              <div className='text-gray-400 mb-2'>
                <svg
                  className='w-12 h-12 mx-auto mb-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                  />
                </svg>
              </div>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>
                No custom templates yet. Upload your own design to get started.
              </p>
            </div>
          )}
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
            onClick={() => onContinue(selectedTemplate, selectedColor, selectedCustomTemplate)}
            className='px-6 py-2 rounded bg-teal-500 text-white font-semibold hover:bg-teal-600'
          >
            Continue with{' '}
            {selectedTemplate === 'custom' && selectedCustomTemplate
              ? selectedCustomTemplate.name
              : templates.find(t => t.name === selectedTemplate)?.label || 'Classic'}
          </button>
        </div>
      </div>

      {showUploadModal && (
        <TemplateUpload
          onClose={() => setShowUploadModal(false)}
          onTemplateUploaded={handleCustomTemplateUploaded}
        />
      )}
    </div>
  )
}
