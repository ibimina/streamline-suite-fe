import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import InternationalPhoneInput from '@/components/common/InternationalPhoneInput'
import { SignupFormData } from '@/types/signup.types'

interface AdminAccountStepProps {
  formMethods: UseFormReturn<SignupFormData>
}

const AdminAccountStep: React.FC<AdminAccountStepProps> = ({ formMethods }) => {
  const {
    register,
    formState: { errors },
  } = formMethods

  return (
    <div className='space-y-6'>
      <div className='text-center mb-8'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Admin Account</h2>
        <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
          Create your administrator account
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label
            htmlFor='firstName'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
          >
            First Name *
          </label>
          <input
            {...register('firstName')}
            type='text'
            id='firstName'
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
            placeholder='Enter your first name'
          />
          {errors.firstName && (
            <p className='mt-1 text-sm text-red-600' role='alert'>
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='lastName'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
          >
            Last Name *
          </label>
          <input
            {...register('lastName')}
            type='text'
            id='lastName'
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
            placeholder='Enter your last name'
          />
          {errors.lastName && (
            <p className='mt-1 text-sm text-red-600' role='alert'>
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
        >
          Email Address *
        </label>
        <input
          {...register('email')}
          type='email'
          id='email'
          className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
          placeholder='Enter your email address'
          autoComplete='email'
        />
        {errors.email && (
          <p className='mt-1 text-sm text-red-600' role='alert'>
            {errors.email.message}
          </p>
        )}
      </div>

      <InternationalPhoneInput
        formMethods={formMethods}
        fieldName='phoneNumber'
        label='Phone Number (Optional)'
        placeholder='Enter your phone number'
      />

      <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
        <div className='flex'>
          <div className='shrink-0'>
            <svg className='h-5 w-5 text-blue-400' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div className='ml-3'>
            <h3 className='text-sm font-medium text-blue-800 dark:text-blue-200'>
              Administrator Account
            </h3>
            <div className='mt-2 text-sm text-blue-700 dark:text-blue-300'>
              <p>
                This will be your main administrator account. You&apos;ll use this email to log in
                and manage your business on Streamline Suite.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAccountStep
