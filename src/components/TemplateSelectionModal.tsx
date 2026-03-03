'use client'
import React, { useState } from 'react'
import { Template, AccentColor, CustomTemplate } from '../types'
import { XIcon } from './Icons'
import TemplateUpload from './TemplateUpload'
import { useGetTemplatesQuery } from '@/store/api'
import { toast } from 'react-toastify'
import Image from 'next/image'

interface TemplateSelectionModalProps {
  onContinue: (
    template: Template,
    color: AccentColor | string,
    customTemplate?: CustomTemplate
  ) => void
  onClose: () => void
}

const templates: { name: Template; label: string }[] = [
  { name: 'classic', label: 'Classic' },
  { name: 'modern', label: 'Modern' },
  { name: 'minimalist', label: 'Minimalist' },
  { name: 'corporate', label: 'Corporate' },
  { name: 'creative', label: 'Creative' },
]

const presetColors: { name: AccentColor; label: string; hex: string }[] = [
  { name: 'teal', label: 'Teal', hex: '#14b8a6' },
  { name: 'blue', label: 'Blue', hex: '#3b82f6' },
  { name: 'crimson', label: 'Crimson', hex: '#dc2626' },
  { name: 'slate', label: 'Slate', hex: '#475569' },
  { name: 'purple', label: 'Purple', hex: '#8b5cf6' },
  { name: 'emerald', label: 'Emerald', hex: '#10b981' },
  { name: 'orange', label: 'Orange', hex: '#f97316' },
  { name: 'pink', label: 'Pink', hex: '#ec4899' },
  { name: 'indigo', label: 'Indigo', hex: '#6366f1' },
  { name: 'amber', label: 'Amber', hex: '#f59e0b' },
]

export const TemplateSelectionModal: React.FC<TemplateSelectionModalProps> = ({
  onContinue,
  onClose,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>('classic')
  const [selectedColor, setSelectedColor] = useState<string>('#14b8a6')
  const [selectedColorName, setSelectedColorName] = useState<AccentColor | 'custom'>('teal')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedCustomTemplate, setSelectedCustomTemplate] = useState<CustomTemplate | undefined>()
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Fetch templates from API
  const {
    data: templatesData,
    isLoading: isLoadingTemplates,
    refetch: refetchTemplates,
  } = useGetTemplatesQuery()
  const customTemplates = templatesData?.payload || []

  const handlePresetColorSelect = (color: (typeof presetColors)[0]) => {
    setSelectedColor(color.hex)
    setSelectedColorName(color.name)
    setShowColorPicker(false)
  }

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value)
    setSelectedColorName('custom')
  }

  const handleCustomTemplateUploaded = (template: CustomTemplate) => {
    // Refetch templates from API to get the latest list
    refetchTemplates()
    setShowUploadModal(false)
    setSelectedTemplate('custom')
    setSelectedCustomTemplate(template)

    // Show success notification
    toast.success(`Custom template "${template.name}" has been uploaded and is now available!`)
  }

  const TemplatePreview: React.FC<{ template: { name: Template; label: string } }> = ({
    template,
  }) => (
    <div
      key={template.name}
      onClick={() => setSelectedTemplate(template.name)}
      className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${selectedTemplate === template.name ? 'border-primary shadow-lg' : 'border-border'}`}
    >
      <h3 className='font-semibold text-md mb-2 text-center'>{template.label}</h3>
      <div className='h-40 bg-white dark:bg-gray-800 rounded-md p-2 flex overflow-hidden text-[4px] leading-tight relative'>
        {template.name === 'classic' && (
          <div className='w-full flex flex-col relative'>
            {/* Classic: Subtle centered watermark */}
            <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
              <div
                className='text-[10px] font-bold opacity-[0.06] uppercase tracking-widest'
                style={{ color: selectedColor }}
              >
                COMPANY
              </div>
            </div>

            <div className='flex justify-between items-start relative z-10'>
              <div className='w-1/3 h-4 bg-gray-200 dark:bg-gray-600'></div>
              <div className='h-4 w-1/3' style={{ backgroundColor: selectedColor }}></div>
            </div>
            <div className='h-2 w-1/4 mt-4 bg-gray-100 dark:bg-gray-700 relative z-10'></div>
            <div className='h-1 w-1/2 mt-1 bg-gray-100 dark:bg-gray-700 relative z-10'></div>
            <div
              className='h-2.5 w-full mt-auto relative z-10'
              style={{ backgroundColor: selectedColor }}
            ></div>
          </div>
        )}
        {template.name === 'modern' && (
          <div className='w-full flex flex-col relative'>
            {/* Modern: Corner gradient watermark */}
            <div
              className='absolute bottom-0 right-0 w-16 h-16 opacity-[0.08] rounded-tl-full'
              style={{
                background: `radial-gradient(circle at bottom right, ${selectedColor}, transparent)`,
              }}
            ></div>

            <div
              className='h-8 w-full rounded-t-sm flex items-center px-2 justify-between relative z-10'
              style={{ backgroundColor: selectedColor }}
            >
              <div className='w-1/4 h-2 bg-white/50'></div>
              <div className='w-1/4 h-2 bg-white/50'></div>
            </div>
            <div className='h-2 w-1/4 mt-4 bg-gray-100 dark:bg-gray-700 relative z-10'></div>
            <div className='h-1 w-1/2 mt-1 bg-gray-100 dark:bg-gray-700 relative z-10'></div>
            <div className='h-2.5 w-full mt-auto bg-gray-200 dark:bg-gray-600 relative z-10'></div>
          </div>
        )}
        {template.name === 'minimalist' && (
          <div className='w-full flex flex-col p-1 relative'>
            {/* Minimalist: Single line watermark */}
            <div
              className='absolute top-1/2 left-0 right-0 h-px opacity-[0.1]'
              style={{ backgroundColor: selectedColor }}
            ></div>

            <div className='flex justify-between items-start relative z-10'>
              <div className='w-1/3 h-2 bg-gray-200 dark:bg-gray-600'></div>
              <div className='h-2 w-1/3' style={{ backgroundColor: selectedColor }}></div>
            </div>
            <div className='w-full h-px my-3 bg-gray-200 dark:bg-gray-600 relative z-10'></div>
            <div className='h-1 w-1/4 bg-gray-100 dark:bg-gray-700 relative z-10'></div>
            <div className='h-1 w-1/2 mt-1 bg-gray-100 dark:bg-gray-700 relative z-10'></div>
            <div className='w-full h-px mt-auto mb-1 bg-gray-200 dark:bg-gray-600 relative z-10'></div>
          </div>
        )}
        {template.name === 'corporate' && (
          <div className='w-full flex relative'>
            {/* Corporate: Vertical stripe watermark on right */}
            <div
              className='absolute right-2 top-0 bottom-0 w-1 opacity-[0.15]'
              style={{ backgroundColor: selectedColor }}
            ></div>

            <div
              className='w-1/3 h-full relative z-10'
              style={{ backgroundColor: selectedColor }}
            ></div>
            <div className='w-2/3 flex flex-col pl-2 relative z-10'>
              <div className='h-3 w-full bg-gray-200 dark:bg-gray-600'></div>
              <div className='h-2 w-1/4 mt-4 bg-gray-100 dark:bg-gray-700'></div>
              <div className='h-1 w-1/2 mt-1 bg-gray-100 dark:bg-gray-700'></div>
              <div className='h-2.5 w-full mt-auto bg-gray-200 dark:bg-gray-600'></div>
            </div>
          </div>
        )}
        {template.name === 'creative' && (
          <div className='w-full flex flex-col relative overflow-hidden'>
            {/* Creative: Diagonal text watermark */}
            <div
              className='absolute inset-0 flex items-center justify-center pointer-events-none'
              style={{ transform: 'rotate(-45deg)' }}
            >
              <div
                className='text-[8px] font-bold opacity-[0.08] whitespace-nowrap tracking-wider'
                style={{ color: selectedColor }}
              >
                CREATIVE DESIGN
              </div>
            </div>
            {/* Diagonal bar */}
            <div
              className='absolute top-1/2 left-1/2 w-[200%] h-4 opacity-[0.06]'
              style={{
                backgroundColor: selectedColor,
                transform: 'translate(-50%, -50%) rotate(-45deg)',
              }}
            ></div>

            <div className='flex justify-between items-start relative z-10'>
              <div className='w-1/3 h-4 bg-gray-200 dark:bg-gray-600'></div>
              <div
                className='h-4 w-1/4 rounded-sm'
                style={{ backgroundColor: selectedColor }}
              ></div>
            </div>
            <div className='h-2 w-1/4 mt-4 bg-gray-100 dark:bg-gray-700 relative z-10'></div>
            <div className='h-1 w-1/2 mt-1 bg-gray-100 dark:bg-gray-700 relative z-10'></div>
            <div className='h-1 w-1/3 mt-1 bg-gray-100 dark:bg-gray-700 relative z-10'></div>
            <div className='mt-auto flex gap-1 relative z-10'>
              <div className='h-2.5 flex-1 bg-gray-200 dark:bg-gray-600'></div>
              <div className='h-2.5 w-1/4' style={{ backgroundColor: selectedColor }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className='flex justify-center items-center z-50 p-4'>
      <div className='bg-card rounded-lg shadow-xl p-6 w-full max-w-4xl'>
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

          {isLoadingTemplates ? (
            <div className='flex justify-center py-4'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
            </div>
          ) : customTemplates.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
              {customTemplates.map(template => (
                <div
                  key={template._id}
                  onClick={() => {
                    setSelectedTemplate('custom')
                    setSelectedCustomTemplate({
                      id: template._id,
                      name: template.name,
                      description: template.description,
                      imageUrl: template.imageUrl,
                    })
                  }}
                  className={`cursor-pointer border-2 rounded-lg p-2 transition-all ${
                    selectedTemplate === 'custom' && selectedCustomTemplate?.id === template._id
                      ? 'border-primary shadow-lg'
                      : 'border-border'
                  }`}
                >
                  <h4 className='font-semibold text-xs mb-1 text-center truncate'>
                    {template.name}
                  </h4>
                  <div className='h-28 bg-muted rounded overflow-hidden flex items-center justify-center'>
                    {template.imageUrl ? (
                      <Image
                        src={template.imageUrl}
                        alt={template.name}
                        className='h-full object-contain'
                        width={200}
                        height={112}
                      />
                    ) : (
                      <div className='text-muted-foreground text-xs text-center'>
                        <div className='w-8 h-8 mx-auto mb-1 bg-muted rounded'></div>
                        Custom Template
                      </div>
                    )}
                  </div>
                  {template.description && (
                    <p className='text-xs text-muted-foreground mt-1 text-center line-clamp-1'>
                      {template.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className='border-2 border-dashed border-border rounded-lg p-6 text-center'>
              <div className='text-muted-foreground mb-2'>
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
              <p className='text-muted-foreground text-sm'>
                No custom templates yet. Upload your own design to get started.
              </p>
            </div>
          )}
        </div>

        <div className='mt-6'>
          <h3 className='font-semibold text-lg mb-3'>Select Accent Color</h3>

          {/* Preset Colors Grid */}
          <div className='flex flex-wrap gap-3 mb-4'>
            {presetColors.map(color => (
              <button
                key={color.name}
                onClick={() => handlePresetColorSelect(color)}
                title={color.label}
                className={`w-8 h-8 rounded-full transition-all transform hover:scale-110 ${
                  selectedColorName === color.name
                    ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-background scale-110'
                    : ''
                }`}
                style={{ backgroundColor: color.hex }}
              >
                <span className='sr-only'>{color.label}</span>
              </button>
            ))}

            {/* Custom Color Picker Toggle */}
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              title='Custom Color'
              className={`w-8 h-8 rounded-full border-2 border-dashed border-border transition-all transform hover:scale-110 flex items-center justify-center ${
                selectedColorName === 'custom'
                  ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-background'
                  : ''
              }`}
              style={selectedColorName === 'custom' ? { backgroundColor: selectedColor } : {}}
            >
              {selectedColorName !== 'custom' && (
                <svg
                  className='w-4 h-4 text-muted-foreground'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 4v16m8-8H4'
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Custom Color Picker Panel */}
          {showColorPicker && (
            <div className='bg-muted rounded-lg p-4 mb-4'>
              <div className='flex items-center gap-4'>
                <div className='flex-1'>
                  <label className='block text-sm font-medium mb-2'>Pick a Custom Color</label>
                  <div className='flex items-center gap-3'>
                    <input
                      type='color'
                      value={selectedColor}
                      onChange={handleCustomColorChange}
                      className='w-12 h-12 rounded-lg cursor-pointer border-0 p-0'
                    />
                    <input
                      type='text'
                      value={selectedColor}
                      onChange={e => {
                        const hex = e.target.value
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
                          setSelectedColor(hex)
                          if (hex.length === 7) setSelectedColorName('custom')
                        }
                      }}
                      placeholder='#000000'
                      className='w-24 px-3 py-2 border rounded-lg text-sm font-mono'
                    />
                    <div
                      className='w-12 h-12 rounded-lg border'
                      style={{ backgroundColor: selectedColor }}
                    ></div>
                  </div>
                </div>

                {/* Popular Colors */}
                <div>
                  <label className='block text-sm font-medium mb-2'>Popular Colors</label>
                  <div className='flex gap-2'>
                    {[
                      '#000000',
                      '#ffffff',
                      '#374151',
                      '#1e40af',
                      '#047857',
                      '#b91c1c',
                      '#7c3aed',
                      '#ca8a04',
                    ].map(hex => (
                      <button
                        key={hex}
                        onClick={() => {
                          setSelectedColor(hex)
                          setSelectedColorName('custom')
                        }}
                        className='w-6 h-6 rounded border border-border transition-transform hover:scale-110'
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Selected Color Preview */}
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span>Selected:</span>
            <div
              className='w-5 h-5 rounded-full border'
              style={{ backgroundColor: selectedColor }}
            ></div>
            <span className='font-mono'>{selectedColor}</span>
            {selectedColorName !== 'custom' && (
              <span className='capitalize'>({selectedColorName})</span>
            )}
          </div>
        </div>

        <div className='flex justify-end mt-8'>
          <button onClick={onClose} className='mr-2 px-4 py-2 rounded bg-muted'>
            Cancel
          </button>
          <button
            onClick={() =>
              onContinue(
                selectedTemplate,
                selectedColorName === 'custom' ? selectedColor : selectedColorName,
                selectedCustomTemplate
              )
            }
            className='px-6 py-2 rounded bg-primary text-white font-semibold hover:bg-primary'
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
