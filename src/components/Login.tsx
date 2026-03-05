import React, { useState } from 'react'
import { EyeIcon, EyeOffIcon } from './Icons'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginFormData } from '@/types/login.types'
import { loginSchema } from '@/schemas/login.schema'
import { useLoginMutation } from '@/store/api'
import { useRouter } from 'next/navigation'
import InputErrorWrapper from './shared/InputErrorWrapper'
import Link from 'next/link'
import { Shield, Zap, TrendingUp } from 'lucide-react'
import Logo from './shared/Logo'

const Login: React.FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [login, { isLoading }] = useLoginMutation()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('')
      await login(data).unwrap()
      reset()
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Login error:', err)
      const message =
        err?.data?.message ?? err?.message ?? 'Login failed. Please check your credentials.'
      setError(message)
    }
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <div className='min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='grid lg:grid-cols-2 gap-0 w-full max-w-5xl bg-card rounded-2xl shadow-2xl overflow-hidden border border-border'>
        {/* Left Side - Branding */}
        <div className='hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-primary to-primary/80 text-white'>
          <div>
            <div className='flex items-center gap-2 mb-8'>
              <Logo variant='light' className='h-10 w-10' />
              <span className='text-2xl font-bold'>Streamline Suite</span>
            </div>
            <h2 className='text-3xl font-bold mb-4'>Welcome back!</h2>
            <p className='text-white/80 text-lg'>
              Sign in to access your dashboard and manage your business operations seamlessly.
            </p>
          </div>

          <div className='space-y-6'>
            <div className='flex items-start gap-4'>
              <div className='p-2 bg-white/10 rounded-lg'>
                <Zap className='h-6 w-6' />
              </div>
              <div>
                <h4 className='font-semibold'>Fast & Efficient</h4>
                <p className='text-sm text-white/70'>
                  Manage invoices, inventory, and payroll in one place
                </p>
              </div>
            </div>
            <div className='flex items-start gap-4'>
              <div className='p-2 bg-white/10 rounded-lg'>
                <Shield className='h-6 w-6' />
              </div>
              <div>
                <h4 className='font-semibold'>Secure & Reliable</h4>
                <p className='text-sm text-white/70'>256-bit encryption keeps your data safe</p>
              </div>
            </div>
            <div className='flex items-start gap-4'>
              <div className='p-2 bg-white/10 rounded-lg'>
                <TrendingUp className='h-6 w-6' />
              </div>
              <div>
                <h4 className='font-semibold'>Grow Your Business</h4>
                <p className='text-sm text-white/70'>Join 5,000+ businesses already thriving</p>
              </div>
            </div>
          </div>

          <p className='text-sm text-white/60'>© 2026 Streamline Suite. All rights reserved.</p>
        </div>

        {/* Right Side - Form */}
        <div className='p-8 sm:p-12 flex flex-col justify-center'>
          <div className='lg:hidden mb-8 flex items-center gap-2'>
            <Logo className='h-8 w-8' />
            <span className='text-xl font-bold text-foreground'>Streamline Suite</span>
          </div>

          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-foreground'>Sign in to your account</h2>
            <p className='mt-2 text-muted-foreground'>
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-foreground mb-2'>
                Email address
              </label>
              <input
                id='email'
                type='email'
                autoComplete='email'
                {...register('email')}
                className='w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all'
                placeholder='you@company.com'
              />
              {errors.email && <InputErrorWrapper message={errors.email.message || ''} />}
            </div>

            <div>
              <div className='flex items-center justify-between mb-2'>
                <label htmlFor='password' className='block text-sm font-medium text-foreground'>
                  Password
                </label>
                <Link
                  href='/forgot-password'
                  className='text-sm text-primary hover:text-primary/80 font-medium'
                >
                  Forgot password?
                </Link>
              </div>
              <div className='relative'>
                <input
                  id='password'
                  type={isPasswordVisible ? 'text' : 'password'}
                  autoComplete='current-password'
                  {...register('password')}
                  className='w-full px-4 py-3 pr-12 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all'
                  placeholder='Enter your password'
                />
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                  aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                >
                  {isPasswordVisible ? (
                    <EyeOffIcon className='h-5 w-5' />
                  ) : (
                    <EyeIcon className='h-5 w-5' />
                  )}
                </button>
              </div>
              {errors.password && <InputErrorWrapper message={errors.password.message || ''} />}
            </div>

            <div className='flex items-center'>
              <input
                id='remember-me'
                type='checkbox'
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className='h-4 w-4 text-primary focus:ring-primary border-border rounded'
              />
              <label htmlFor='remember-me' className='ml-2 block text-sm text-muted-foreground'>
                Remember me for 30 days
              </label>
            </div>

            {error && (
              <div className='p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
              </div>
            )}

            <button
              type='submit'
              disabled={isLoading}
              className='w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2'
            >
              {isLoading ? (
                <>
                  <svg
                    className='animate-spin h-5 w-5'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className='mt-8'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-border' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-card text-muted-foreground'>New to Streamline Suite?</span>
              </div>
            </div>
            <div className='mt-6'>
              <Link
                href='/signup'
                className='w-full flex justify-center py-3 px-4 border-2 border-border rounded-lg text-sm font-semibold text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all'
              >
                Create an account
              </Link>
            </div>
          </div>

          <div className='mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground'>
            <Shield className='h-4 w-4' />
            <span>Protected by 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
