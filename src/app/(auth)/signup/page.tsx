'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import MultistepSignupForm from '@/components/signup/MultistepSignupForm'
import Link from 'next/link'

const SignUpPage: React.FC = () => {
  const router = useRouter()

  const handleSuccess = () => {
    // Redirect to dashboard after successful signup
    router.push('/dashboard')
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-4xl'>
        <MultistepSignupForm onSuccess={handleSuccess} />

        <div className='mt-8 text-center'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Already have an account?{' '}
            <Link
              href={'/login'}
              className='font-medium text-teal-600 hover:text-teal-500 transition-colors'
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
