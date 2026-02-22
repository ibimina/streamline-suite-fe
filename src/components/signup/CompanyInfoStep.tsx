import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { industryOptions, companySizeOptions, countryOptions } from '@/schemas/signup.schema'
import { SignupFormData } from '@/types/signup.types'

interface CompanyInfoStepProps {
  formMethods: UseFormReturn<SignupFormData>
}

const CompanyInfoStep: React.FC<CompanyInfoStepProps> = ({ formMethods }) => {
  const {
    register,
    formState: { errors },
    watch,
  } = formMethods

  return (
    <div className='space-y-6'>
      <div className='text-center mb-8'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Company Information</h2>
        <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
          Let&apos;s start by learning about your business
        </p>
      </div>

      <div>
        <label
          htmlFor='companyName'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
        >
          Company Name *
        </label>
        <input
          {...register('name')}
          type='text'
          id='name'
          className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
          placeholder='Enter your company name'
        />
        {errors.name && (
          <p className='mt-1 text-sm text-red-600' role='alert'>
            {errors.name.message}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor='companyName'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
        >
          Company Address *
        </label>
        <input
          {...register('address')}
          type='text'
          id='address'
          className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
          placeholder='Enter your company address'
        />
        {errors.address && (
          <p className='mt-1 text-sm text-red-600' role='alert'>
            {errors.address.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor='industry'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
        >
          Industry
        </label>
        <select
          {...register('industry')}
          id='industry'
          className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
        >
          <option value=''>Select your industry</option>
          {industryOptions.map(industry => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
        {errors.industry && (
          <p className='mt-1 text-sm text-red-600' role='alert'>
            {errors.industry.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor='companySize'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
        >
          Company Size
        </label>
        <select
          {...register('companySize')}
          id='companySize'
          className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
        >
          <option value=''>Select company size</option>
          {companySizeOptions.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        {errors.companySize && (
          <p className='mt-1 text-sm text-red-600' role='alert'>
            {errors.companySize.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor='country'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
        >
          Country
        </label>
        <select
          {...register('country')}
          id='country'
          className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
        >
          <option value=''>Select your country</option>
          {countryOptions.map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.country && (
          <p className='mt-1 text-sm text-red-600' role='alert'>
            {errors.country.message}
          </p>
        )}
      </div>
    </div>
  )
}

export default CompanyInfoStep
