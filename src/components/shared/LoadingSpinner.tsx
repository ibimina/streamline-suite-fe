import React from 'react'

export default function LoadingSpinner() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500'></div>
      </div>
    </div>
  )
}
