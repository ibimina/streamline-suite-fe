'use client'
import React, { useState } from 'react'
import Logo from '@/components/Logo'
import { EyeIcon, EyeOffIcon } from '@/components/Icons'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { signUpSuccess } from '@/store/slices/authSlice'

interface SignUpPageProps {
  onNavigateToLogin: () => void
}

const PasswordStrengthMeter: React.FC<{ password: string }> = ({ password }) => {
  const calculateStrength = () => {
    if (!password) return 0

    let variety = 0
    if (/[a-z]/.test(password)) variety++
    if (/[A-Z]/.test(password)) variety++
    if (/[0-9]/.test(password)) variety++
    if (/[^A-Za-z0-9]/.test(password)) variety++

    if (password.length < 8) {
      return 1 // Always weak if short
    }

    // For passwords >= 8 chars, strength is based on variety
    return variety
  }

  const strength = calculateStrength()
  const strengthLevels = [
    { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' },
    { label: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
    { label: 'Strong', color: 'bg-green-500', textColor: 'text-green-500' },
    { label: 'Very Strong', color: 'bg-teal-500', textColor: 'text-teal-500' },
  ]

  return (
    <div className='mt-2' aria-live='polite'>
      <div className='flex space-x-2'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={strength + 1}
            className={`h-1.5 flex-1 rounded-full ${strength > index ? strengthLevels[strength - 1].color : 'bg-gray-200 dark:bg-gray-600'}`}
            role='presentation'
          ></div>
        ))}
      </div>
      {password.length > 0 && strength > 0 && (
        <p className={`text-xs mt-1 font-medium ${strengthLevels[strength - 1].textColor}`}>
          {strengthLevels[strength - 1].label}
        </p>
      )}
    </div>
  )
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigateToLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const dispatch = useAppDispatch()
  const { user, error: authError } = useAppSelector(state => state.auth)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password || !companyName || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    // Simulate successful sign-up and login
    dispatch(signUpSuccess({ email, name: companyName, role: 'user' }))
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <div className='w-full max-w-md mx-auto'>
      <div className='flex justify-center'>
        <Logo className='h-12 w-auto' />
      </div>
      <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white'>
        Create a new account
      </h2>
      <p className='mt-2 text-center text-sm text-gray-600 dark:text-gray-400'>
        to start with Streamline Suite
      </p>

      <div className='mt-8'>
        <div className='bg-white dark:bg-gray-800 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10'>
          <form className='space-y-6' onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor='company-name'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Company Name
              </label>
              <div className='mt-1'>
                <input
                  id='company-name'
                  name='company-name'
                  type='text'
                  autoComplete='organization'
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Email address
              </label>
              <div className='mt-1'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Password
              </label>
              <div className='mt-1 relative'>
                <input
                  id='password'
                  name='password'
                  type={isPasswordVisible ? 'text' : 'password'}
                  autoComplete='new-password'
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className='pr-10 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                />
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                >
                  {isPasswordVisible ? (
                    <EyeOffIcon className='h-5 w-5' />
                  ) : (
                    <EyeIcon className='h-5 w-5' />
                  )}
                </button>
              </div>
              <PasswordStrengthMeter password={password} />
            </div>

            <div>
              <label
                htmlFor='confirm-password'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Confirm Password
              </label>
              <div className='mt-1 relative'>
                <input
                  id='confirm-password'
                  name='confirm-password'
                  type={isPasswordVisible ? 'text' : 'password'}
                  autoComplete='new-password'
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className='pr-10 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                />
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                >
                  {isPasswordVisible ? (
                    <EyeOffIcon className='h-5 w-5' />
                  ) : (
                    <EyeIcon className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className='text-sm text-red-500' role='alert'>
                {error}
              </p>
            )}

            <div>
              <button
                type='submit'
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
              >
                Create Account
              </button>
            </div>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Already have an account?{' '}
              <button
                onClick={onNavigateToLogin}
                className='font-medium text-teal-600 hover:text-teal-500'
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
