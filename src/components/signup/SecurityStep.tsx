import React, { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { EyeIcon, EyeOffIcon } from '@/components/Icons'
import { SignupFormData } from '@/types/signup.types'
import InputErrorWrapper from '../shared/InputErrorWrapper'

interface SecurityStepProps {
  formMethods: UseFormReturn<SignupFormData>
}

const PasswordStrengthMeter: React.FC<{ password: string }> = ({ password }) => {
  const calculateStrength = () => {
    if (!password) return 0

    let score = 0

    // Length check
    if (password.length >= 8) score++
    if (password.length >= 12) score++

    // Character variety checks
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    return Math.min(score, 4)
  }

  const strength = calculateStrength()
  const strengthLevels = [
    { label: 'Very Weak', color: 'bg-red-500', textColor: 'text-red-500' },
    { label: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-500' },
    { label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
    { label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-500' },
    { label: 'Strong', color: 'bg-green-500', textColor: 'text-green-500' },
  ]

  if (!password) return null

  return (
    <div className='mt-2' aria-live='polite'>
      <div className='flex space-x-1'>
        {(() => {
          const barIds = ['bar-1', 'bar-2', 'bar-3', 'bar-4']
          return barIds.map((id, i) => (
            <div
              key={id}
              className={`h-2 flex-1 rounded-full transition-colors ${
                strength > i ? strengthLevels[strength].color : 'bg-muted'
              }`}
              role='presentation'
            />
          ))
        })()}
      </div>
      <p className={`text-xs mt-1 font-medium ${strengthLevels[strength].textColor}`}>
        Password strength: {strengthLevels[strength].label}
      </p>

      <div className='mt-2 text-xs text-muted-foreground'>
        <p>Password must contain:</p>
        <ul className='list-disc list-inside space-y-1 mt-1'>
          <li className={password.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}>
            At least 8 characters
          </li>
          <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
            One uppercase letter
          </li>
          <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
            One lowercase letter
          </li>
          <li className={/[0-9]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
            One number
          </li>
          <li
            className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}
          >
            One special character
          </li>
        </ul>
      </div>
    </div>
  )
}

const SecurityStep: React.FC<SecurityStepProps> = ({ formMethods }) => {
  const {
    register,
    formState: { errors },
    watch,
  } = formMethods
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible)
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)

  return (
    <div className='space-y-6'>
      <div className='text-center mb-8'>
        <h2 className='text-2xl font-bold text-foreground'>Security & Terms</h2>
        <p className='text-sm text-muted-foreground mt-2'>
          Set up your password and agree to our terms
        </p>
      </div>

      <div>
        <label
          htmlFor='password'
          className='block text-sm font-medium text-secondary-foreground mb-2'
        >
          Password *
        </label>
        <div className='relative'>
          <input
            {...register('password')}
            type={isPasswordVisible ? 'text' : 'password'}
            id='password'
            className='w-full px-3 py-2 pr-10 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card text-foreground'
            placeholder='Create a strong password'
            autoComplete='new-password'
          />
          <button
            type='button'
            onClick={togglePasswordVisibility}
            className='absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-secondary-foreground dark:hover:text-muted-foreground'
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? (
              <EyeOffIcon className='h-5 w-5' />
            ) : (
              <EyeIcon className='h-5 w-5' />
            )}
          </button>
        </div>
        <PasswordStrengthMeter password={password || ''} />
        {errors.password && <InputErrorWrapper message={errors.password.message || ''} />}
      </div>

      <div>
        <label
          htmlFor='confirmPassword'
          className='block text-sm font-medium text-secondary-foreground mb-2'
        >
          Confirm Password *
        </label>
        <div className='relative'>
          <input
            {...register('confirmPassword')}
            type={isConfirmPasswordVisible ? 'text' : 'password'}
            id='confirmPassword'
            className='w-full px-3 py-2 pr-10 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card text-foreground'
            placeholder='Confirm your password'
            autoComplete='new-password'
          />
          <button
            type='button'
            onClick={toggleConfirmPasswordVisibility}
            className='absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-secondary-foreground dark:hover:text-muted-foreground'
            aria-label={isConfirmPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isConfirmPasswordVisible ? (
              <EyeOffIcon className='h-5 w-5' />
            ) : (
              <EyeIcon className='h-5 w-5' />
            )}
          </button>
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className='mt-1 text-sm text-red-600' role='alert'>
            Passwords do not match
          </p>
        )}
        {errors.confirmPassword && (
          <InputErrorWrapper message={errors.confirmPassword.message || ''} />
        )}
      </div>

      <div className='space-y-4'>
        <div className='flex items-start'>
          <div className='flex items-center h-5'>
            <input
              {...register('agreeToTerms')}
              id='agreeToTerms'
              type='checkbox'
              className='h-4 w-4 text-primary focus:ring-primary border-border rounded'
            />
          </div>
          <div className='ml-3 text-sm'>
            <label htmlFor='agreeToTerms' className='text-secondary-foreground'>
              I agree to the{' '}
              <a
                href='/terms'
                className='text-primary hover:text-primary underline'
                target='_blank'
                rel='noopener noreferrer'
              >
                Terms and Conditions
              </a>
              *
            </label>
            {errors.agreeToTerms && (
              <InputErrorWrapper message={errors.agreeToTerms.message || ''} />
            )}
          </div>
        </div>

        <div className='flex items-start'>
          <div className='flex items-center h-5'>
            <input
              {...register('agreeToPrivacy')}
              id='agreeToPrivacy'
              type='checkbox'
              className='h-4 w-4 text-primary focus:ring-primary border-border rounded'
            />
          </div>
          <div className='ml-3 text-sm'>
            <label htmlFor='agreeToPrivacy' className='text-secondary-foreground'>
              I agree to the{' '}
              <a
                href='/privacy'
                className='text-primary hover:text-primary underline'
                target='_blank'
                rel='noopener noreferrer'
              >
                Privacy Policy
              </a>
              *
            </label>
            {errors.agreeToPrivacy && (
              <InputErrorWrapper message={errors.agreeToPrivacy.message || ''} />
            )}
          </div>
        </div>
      </div>

      <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg'>
        <div className='flex'>
          <div className='shrink-0'>
            <svg className='h-5 w-5 text-green-400' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div className='ml-3'>
            <h3 className='text-sm font-medium text-green-800 dark:text-green-200'>Almost Done!</h3>
            <div className='mt-2 text-sm text-green-700 dark:text-green-300'>
              <p>
                You&apos;re just one step away from creating your Streamline Suite account. Click
                &quot;Create Account&quot; to get started.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecurityStep
