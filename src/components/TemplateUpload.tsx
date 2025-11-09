import React, { useState, useRef } from 'react'
import { CustomTemplate, TemplatePlaceholder } from '../types'
import { addCustomTemplate } from '../store/slices/companySlice'
import { useAppDispatch } from '@/store/hooks'

interface TemplateUploadProps {
  onClose: () => void
  onTemplateUploaded: (template: CustomTemplate) => void
}

export default function TemplateUpload({ onClose, onTemplateUploaded }: TemplateUploadProps) {
  const dispatch = useAppDispatch()
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [placeholders, setPlaceholders] = useState<TemplatePlaceholder[]>([])
  const [currentStep, setCurrentStep] = useState<'upload' | 'placeholders' | 'preview'>('upload')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setSelectedFile(file)
    setIsProcessing(true)

    try {
      // Create preview URL for the PDF
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      // For now, we'll set some default placeholders
      // In a real implementation, you'd use PDF parsing libraries
      const defaultPlaceholders: TemplatePlaceholder[] = [
        {
          id: 'documentTitle',
          type: 'text',
          x: 450,
          y: 160, // Moved down from 30 to avoid letterhead
          fontSize: 24,
          fontWeight: 'bold',
          align: 'right',
        },
        {
          id: 'companyName',
          type: 'text',
          x: 50,
          y: 50,
          fontSize: 18,
          fontWeight: 'bold',
          align: 'left',
        },
        {
          id: 'companyAddress',
          type: 'text',
          x: 50,
          y: 80,
          fontSize: 10,
          align: 'left',
        },
        {
          id: 'documentNumber',
          type: 'text',
          x: 550,
          y: 180, // Moved down to align with title
          fontSize: 12,
          align: 'right',
        },
        {
          id: 'documentDate',
          type: 'date',
          x: 550,
          y: 155, // Moved down to align with document number
          fontSize: 10,
          align: 'right',
          format: 'MM/DD/YYYY',
        },
        {
          id: 'customerName',
          type: 'text',
          x: 50,
          y: 200, // Moved down to give more space
          fontSize: 12,
          fontWeight: 'bold',
        },
        {
          id: 'customerAddress',
          type: 'text',
          x: 50,
          y: 220, // Moved down accordingly
          fontSize: 10,
          maxLines: 3,
        },
        {
          id: 'itemsTable',
          type: 'table',
          x: 50,
          y: 260, // Moved down to give space for customer info
          width: 550,
          height: 200,
        },
        {
          id: 'subtotal',
          type: 'text',
          x: 550,
          y: 470, // Moved down accordingly
          fontSize: 10,
          align: 'right',
        },
        {
          id: 'vat',
          type: 'text',
          x: 550,
          y: 490, // Moved down accordingly
          fontSize: 10,
          align: 'right',
        },
        {
          id: 'total',
          type: 'text',
          x: 550,
          y: 510, // Moved down accordingly
          fontSize: 14,
          fontWeight: 'bold',
          align: 'right',
        },
        {
          id: 'terms',
          type: 'text',
          x: 50,
          y: 550, // Moved down accordingly
          fontSize: 10,
          maxLines: 10,
          width: 500,
        },
      ]

      setPlaceholders(defaultPlaceholders)
      setCurrentStep('placeholders')
    } catch (error) {
      console.error('Error processing file:', error)
      alert('Error processing the PDF file')
    } finally {
      setIsProcessing(false)
    }
  }

  const updatePlaceholder = (id: string, updates: Partial<TemplatePlaceholder>) => {
    setPlaceholders(prev =>
      prev.map(placeholder =>
        placeholder.id === id ? { ...placeholder, ...updates } : placeholder
      )
    )
  }

  const addCustomPlaceholder = () => {
    const newPlaceholder: TemplatePlaceholder = {
      id: `custom_${Date.now()}`,
      type: 'text',
      x: 100,
      y: 100,
      fontSize: 10,
      align: 'left',
    }
    setPlaceholders(prev => [...prev, newPlaceholder])
  }

  const removePlaceholder = (id: string) => {
    setPlaceholders(prev => prev.filter(p => p.id !== id))
  }

  const handleSaveTemplate = async () => {
    if (!selectedFile || !templateName.trim()) {
      alert('Please provide a template name and select a file')
      return
    }

    try {
      // Convert file to base64 for serializable storage
      const base64File = await fileToBase64(selectedFile)

      const customTemplate: CustomTemplate = {
        id: `custom_${Date.now()}`,
        name: templateName.trim(),
        description: templateDescription.trim(),
        templateFile: base64File,
        placeholders,
        dimensions: {
          width: 595, // A4 width in points
          height: 842, // A4 height in points
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Save to Redux store
      dispatch(addCustomTemplate(customTemplate))

      // Also call the callback for immediate UI update
      onTemplateUploaded(customTemplate)
      onClose()
    } catch (error) {
      console.error('Error saving custom template:', error)
      alert('Failed to save custom template. Please try again.')
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold'>Upload Custom Template</h2>
          <button onClick={onClose} className='text-gray-500 hover:text-gray-700 text-2xl'>
            ×
          </button>
        </div>

        {/* Progress Steps */}
        <div className='flex items-center mb-6'>
          <div
            className={`flex items-center ${currentStep === 'upload' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                currentStep === 'upload'
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300'
              }`}
            >
              1
            </div>
            <span className='ml-2 font-medium'>Upload</span>
          </div>
          <div className='flex-1 h-0.5 bg-gray-300 mx-4'></div>
          <div
            className={`flex items-center ${currentStep === 'placeholders' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                currentStep === 'placeholders'
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300'
              }`}
            >
              2
            </div>
            <span className='ml-2 font-medium'>Configure</span>
          </div>
          <div className='flex-1 h-0.5 bg-gray-300 mx-4'></div>
          <div
            className={`flex items-center ${currentStep === 'preview' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                currentStep === 'preview'
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300'
              }`}
            >
              3
            </div>
            <span className='ml-2 font-medium'>Save</span>
          </div>
        </div>

        {/* Step 1: Upload */}
        {currentStep === 'upload' && (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Template Name *</label>
              <input
                type='text'
                value={templateName}
                onChange={e => setTemplateName(e.target.value)}
                className='w-full border rounded-lg px-3 py-2'
                placeholder='e.g., Corporate Letterhead'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>Description</label>
              <textarea
                value={templateDescription}
                onChange={e => setTemplateDescription(e.target.value)}
                className='w-full border rounded-lg px-3 py-2'
                rows={3}
                placeholder='Brief description of this template...'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>
                Template File (PDF or Image) *
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400'
              >
                {selectedFile ? (
                  <div>
                    <p className='text-green-600 font-medium'>{selectedFile.name}</p>
                    <p className='text-sm text-gray-500'>Click to change file</p>
                  </div>
                ) : (
                  <div>
                    <p className='text-gray-600'>Click to upload image template</p>
                    <p className='text-sm text-gray-400'>image files only</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleFileSelect}
                className='hidden'
              />
            </div>

            {isProcessing && (
              <div className='text-center py-4'>
                <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                <p className='mt-2 text-gray-600'>Processing template...</p>
              </div>
            )}

            <div className='flex justify-end'>
              <button
                onClick={() => setCurrentStep('placeholders')}
                disabled={!selectedFile || !templateName.trim()}
                className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
              >
                Next: Configure Placeholders
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Configure Placeholders */}
        {currentStep === 'placeholders' && (
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <h3 className='text-lg font-medium'>Configure Content Placeholders</h3>
              <button
                onClick={addCustomPlaceholder}
                className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm'
              >
                Add Custom Placeholder
              </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div className='space-y-3'>
                <h4 className='font-medium'>Placeholders</h4>
                <div className='max-h-96 overflow-y-auto space-y-3'>
                  {placeholders.map(placeholder => (
                    <div key={placeholder.id} className='border rounded-lg p-4 bg-gray-50'>
                      <div className='flex justify-between items-start mb-3'>
                        <span className='font-medium text-sm'>{placeholder.id}</span>
                        <button
                          onClick={() => removePlaceholder(placeholder.id)}
                          className='text-red-500 hover:text-red-700 text-sm'
                        >
                          Remove
                        </button>
                      </div>

                      <div className='grid grid-cols-2 gap-3 text-sm'>
                        <div>
                          <label className='block text-xs font-medium mb-1'>Type</label>
                          <select
                            value={placeholder.type}
                            onChange={e =>
                              updatePlaceholder(placeholder.id, { type: e.target.value as any })
                            }
                            className='w-full border rounded px-2 py-1 text-xs'
                          >
                            <option value='text'>Text</option>
                            <option value='image'>Image</option>
                            <option value='table'>Table</option>
                            <option value='currency'>Currency</option>
                            <option value='date'>Date</option>
                          </select>
                        </div>

                        <div>
                          <label className='block text-xs font-medium mb-1'>Position X</label>
                          <input
                            type='number'
                            value={placeholder.x}
                            onChange={e =>
                              updatePlaceholder(placeholder.id, { x: Number(e.target.value) })
                            }
                            className='w-full border rounded px-2 py-1 text-xs'
                          />
                        </div>

                        <div>
                          <label className='block text-xs font-medium mb-1'>Position Y</label>
                          <input
                            type='number'
                            value={placeholder.y}
                            onChange={e =>
                              updatePlaceholder(placeholder.id, { y: Number(e.target.value) })
                            }
                            className='w-full border rounded px-2 py-1 text-xs'
                          />
                        </div>

                        <div>
                          <label className='block text-xs font-medium mb-1'>Font Size</label>
                          <input
                            type='number'
                            value={placeholder.fontSize || 10}
                            onChange={e =>
                              updatePlaceholder(placeholder.id, {
                                fontSize: Number(e.target.value),
                              })
                            }
                            className='w-full border rounded px-2 py-1 text-xs'
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='space-y-3'>
                <h4 className='font-medium'>Template Preview</h4>
                <div className='border rounded-lg p-4 bg-gray-100 min-h-96'>
                  {previewUrl ? (
                    <iframe
                      src={previewUrl}
                      className='w-full h-96 border rounded'
                      title='Template Preview'
                    />
                  ) : (
                    <div className='h-96 flex items-center justify-center text-gray-500'>
                      PDF preview will appear here
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='flex justify-between'>
              <button
                onClick={() => setCurrentStep('upload')}
                className='border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50'
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep('preview')}
                className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700'
              >
                Next: Preview & Save
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preview & Save */}
        {currentStep === 'preview' && (
          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Review Template</h3>

            <div className='bg-gray-50 rounded-lg p-4'>
              <h4 className='font-medium mb-2'>Template Details</h4>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='font-medium'>Name:</span> {templateName}
                </div>
                <div>
                  <span className='font-medium'>File:</span> {selectedFile?.name}
                </div>
                <div className='col-span-2'>
                  <span className='font-medium'>Description:</span>{' '}
                  {templateDescription || 'No description'}
                </div>
                <div>
                  <span className='font-medium'>Placeholders:</span> {placeholders.length}
                </div>
              </div>
            </div>

            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <h4 className='font-medium text-blue-800 mb-2'>How it works:</h4>
              <ul className='text-sm text-blue-700 space-y-1'>
                <li>• Your PDF template will be used as the base design</li>
                <li>• Content will be dynamically placed at the configured positions</li>
                <li>• You can modify placeholder positions anytime</li>
                <li>• The template will appear in your template selection options</li>
              </ul>
            </div>

            <div className='flex justify-between'>
              <button
                onClick={() => setCurrentStep('placeholders')}
                className='border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50'
              >
                Back
              </button>
              <button
                onClick={handleSaveTemplate}
                className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700'
              >
                Save Template
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
