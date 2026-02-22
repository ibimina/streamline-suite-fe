import React from 'react'

export default function InputErrorWrapper({ message }: { message: string }) {
  return (
    <p className='mt-1 text-sm text-red-600' role='alert'>
      {message}
    </p>
  )
}
