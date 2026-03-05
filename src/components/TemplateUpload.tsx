import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { CustomTemplate } from '../types'
import { useUploadTemplateMutation } from '@/store/api'
import { toast } from 'react-toastify'

interface TemplateUploadProps {
  onClose: () => void
  onTemplateUploaded: (template: CustomTemplate) => void
}

export default function TemplateUpload({ onClose, onTemplateUploaded }: TemplateUploadProps) {
  const [uploadTemplate, { isLoading: isUploading }] = useUploadTemplateMutation()
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [currentStep, setCurrentStep] = useState<'upload' | 'preview'>('upload')

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
      toast.warning('Please select an image file (PNG, JPG, etc.)')
      return
    }

    setSelectedFile(file)
    setIsProcessing(true)

    try {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } catch (error) {
      toast.error('Error processing the image file')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSaveTemplate = async () => {
    if (!selectedFile || !templateName.trim()) {
      toast.warning('Please provide a template name and select a file')
      return
    }

    try {
      // Convert file to base64 for API upload
      const base64File = await fileToBase64(selectedFile)

      // Call the backend API to upload template
      const response = await uploadTemplate({
        file: base64File,
        imagePath: `templates/${templateName.trim().replace(/\s+/g, '-').toLowerCase()}`,
        resourceType: 'image',
        name: templateName.trim(),
        description: templateDescription.trim(),
      }).unwrap()

      // Create template object from API response
      const customTemplate: CustomTemplate = {
        id: response.payload.template._id,
        name: response.payload.template.name,
        description: response.payload.template.description || '',
        imageUrl: response.payload.template.imageUrl,
      }

      // Notify parent component
      onTemplateUploaded(customTemplate)
      onClose()
    } catch (error) {
      toast.error('Failed to save custom template. Please try again.')
    }
  }

  return (
    <div className='fixed inset-0 bg-black/20 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-card rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold'>Upload Letterhead Template</h2>
          <button
            onClick={onClose}
            className='text-muted-foreground hover:text-secondary-foreground text-2xl'
          >
            ×
          </button>
        </div>

        {/* Progress Steps */}
        <div className='flex items-center mb-6'>
          <div
            className={`flex items-center ${currentStep === 'upload' ? 'text-blue-600' : 'text-muted-foreground'}`}
          >
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                currentStep === 'upload'
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-border'
              }`}
            >
              1
            </div>
            <span className='ml-2 font-medium'>Upload</span>
          </div>
          <div className='flex-1 h-0.5 bg-muted mx-4'></div>
          <div
            className={`flex items-center ${currentStep === 'preview' ? 'text-blue-600' : 'text-muted-foreground'}`}
          >
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                currentStep === 'preview'
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-border'
              }`}
            >
              2
            </div>
            <span className='ml-2 font-medium'>Preview & Save</span>
          </div>
        </div>

        {/* Step 1: Upload */}
        {currentStep === 'upload' && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Left: Form Fields */}
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
                <label className='block text-sm font-medium mb-2'>Letterhead Image *</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className='border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors'
                >
                  {selectedFile ? (
                    <div>
                      <p className='text-green-600 font-medium'>{selectedFile.name}</p>
                      <p className='text-sm text-muted-foreground'>Click to change file</p>
                    </div>
                  ) : (
                    <div>
                      <svg
                        className='w-10 h-10 mx-auto mb-2 text-muted-foreground'
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
                      <p className='text-muted-foreground'>Click to upload letterhead image</p>
                      <p className='text-sm text-muted-foreground'>
                        PNG, JPG (recommended: A4 size)
                      </p>
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
                  <p className='mt-2 text-muted-foreground'>Processing image...</p>
                </div>
              )}

              <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3'>
                <p className='text-sm text-blue-700 dark:text-blue-300'>
                  💡 Your letterhead image will be used as a background for invoices and quotations.
                  Invoice content will be placed automatically using standard positioning.
                </p>
              </div>

              <div className='flex justify-end pt-2'>
                <button
                  onClick={() => setCurrentStep('preview')}
                  disabled={!selectedFile || !templateName.trim()}
                  className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed'
                >
                  Next: Preview
                </button>
              </div>
            </div>

            {/* Right: Preview */}
            <div className='space-y-3'>
              <h4 className='font-medium'>Template Preview</h4>
              <div
                className='border rounded-lg bg-muted overflow-hidden relative'
                style={{ aspectRatio: '210/297' }}
              >
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt='Template Preview'
                    className='w-full h-full object-contain'
                    fill
                    unoptimized
                  />
                ) : (
                  <div className='h-full flex items-center justify-center text-muted-foreground'>
                    <div className='text-center'>
                      <svg
                        className='w-12 h-12 mx-auto mb-2 text-muted-foreground/50'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1.5}
                          d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                        />
                      </svg>
                      <p>Preview will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Preview & Save */}
        {currentStep === 'preview' && (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Left: Full Preview */}
              <div className='space-y-3'>
                <h4 className='font-medium'>Full Template Preview</h4>
                <div
                  className='border rounded-lg bg-white dark:bg-muted overflow-hidden shadow-sm relative'
                  style={{ aspectRatio: '210/297' }}
                >
                  {previewUrl && (
                    <Image
                      src={previewUrl}
                      alt='Template Preview'
                      className='w-full h-full object-contain'
                      fill
                      unoptimized
                    />
                  )}
                </div>
              </div>

              {/* Right: Details */}
              <div className='space-y-4'>
                <div className='bg-muted rounded-lg p-4'>
                  <h4 className='font-medium mb-3'>Template Details</h4>
                  <div className='space-y-3 text-sm'>
                    <div>
                      <span className='font-medium text-muted-foreground'>Name:</span>
                      <p className='mt-1'>{templateName}</p>
                    </div>
                    <div>
                      <span className='font-medium text-muted-foreground'>File:</span>
                      <p className='mt-1'>{selectedFile?.name}</p>
                    </div>
                    <div>
                      <span className='font-medium text-muted-foreground'>Description:</span>
                      <p className='mt-1'>{templateDescription || 'No description'}</p>
                    </div>
                  </div>
                </div>

                <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
                  <h4 className='font-medium text-blue-800 dark:text-blue-300 mb-2'>
                    How it works:
                  </h4>
                  <ul className='text-sm text-blue-700 dark:text-blue-300 space-y-1'>
                    <li>• Your letterhead will be used as the background</li>
                    <li>• Invoice/quotation content is placed automatically</li>
                    <li>• The template will appear in your template selection</li>
                  </ul>
                </div>

                <div className='flex justify-between pt-4'>
                  <button
                    onClick={() => setCurrentStep('upload')}
                    disabled={isUploading}
                    className='border border-border text-secondary-foreground px-6 py-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSaveTemplate}
                    disabled={isUploading}
                    className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                  >
                    {isUploading ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                        Uploading...
                      </>
                    ) : (
                      'Save Template'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
