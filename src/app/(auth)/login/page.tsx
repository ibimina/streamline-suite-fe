'use client'
import React, { useState } from 'react'
import Logo from '@/components/Logo'
import { EyeIcon, EyeOffIcon } from '@/components/Icons'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginSuccess } from '@/store/slices/authSlice'
import { useRouter } from 'next/navigation'

interface LoginProps {
  onNavigateToSignUp: () => void
}

const Login: React.FC<LoginProps> = ({ onNavigateToSignUp }) => {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const dispatch = useAppDispatch()
  const { user, error: authError } = useAppSelector(state => state.auth)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }
    // Simulate successful login
    dispatch(loginSuccess({ email, name: 'Admin User', role: 'admin' }))
    router.push('/dashboard')
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <div className='w-full max-w-md mx-auto'>
      {/* <div className="flex justify-center">
            <Logo className="h-12 w-auto" />
        </div> */}
      <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white'>
        Sign in to your account
      </h2>
      <p className='mt-2 text-center text-sm text-gray-600 dark:text-gray-400'>
        to continue to Streamline Suite
      </p>

      <div className='mt-8'>
        <div className='bg-white dark:bg-gray-800 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10'>
          <form className='space-y-6' onSubmit={handleSubmit}>
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
                  autoComplete='current-password'
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
            </div>

            {error && <p className='text-sm text-red-500'>{error}</p>}

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-gray-900 dark:text-gray-300'
                >
                  Remember me
                </label>
              </div>

              <div className='text-sm'>
                <a href='#' className='font-medium text-teal-600 hover:text-teal-500'>
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type='submit'
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
              >
                Sign in
              </button>
            </div>
          </form>
          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300 dark:border-gray-600' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'>
                  Don&apos;t have an account?
                </span>
              </div>
            </div>
            <div className='mt-6'>
              <button
                onClick={onNavigateToSignUp}
                className='w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
              >
                Create an account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
