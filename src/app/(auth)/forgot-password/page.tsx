'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Mail, ArrowLeft, Shield, CheckCircle2 } from 'lucide-react'
import Logo from '@/components/shared/Logo'
import InputErrorWrapper from '@/components/shared/InputErrorWrapper'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>

const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true)
    try {
      // TODO: Call API to send reset email
      // await forgotPassword(data.email)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      setSubmittedEmail(data.email)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Forgot password error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md'>
        <div className='bg-card rounded-2xl shadow-2xl border border-border p-8'>
          <div className='flex items-center gap-2 mb-8'>
            <Logo className='h-8 w-8' />
            <span className='text-xl font-bold text-foreground'>Streamline Suite</span>
          </div>

          {isSubmitted ? (
            <div className='text-center'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-6'>
                <CheckCircle2 className='h-8 w-8 text-green-600 dark:text-green-400' />
              </div>
              <h2 className='text-2xl font-bold text-foreground mb-2'>Check your email</h2>
              <p className='text-muted-foreground mb-6'>
                We&apos;ve sent a password reset link to{' '}
                <span className='font-medium text-foreground'>{submittedEmail}</span>
              </p>
              <p className='text-sm text-muted-foreground mb-8'>
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className='text-primary hover:text-primary/80 font-medium'
                >
                  try again
                </button>
              </p>
              <Link
                href='/login'
                className='inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium'
              >
                <ArrowLeft className='h-4 w-4' />
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <div className='mb-8'>
                <h2 className='text-2xl font-bold text-foreground'>Forgot your password?</h2>
                <p className='mt-2 text-muted-foreground'>
                  No worries! Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                <div>
                  <label htmlFor='email' className='block text-sm font-medium text-foreground mb-2'>
                    Email address
                  </label>
                  <div className='relative'>
                    <input
                      id='email'
                      type='email'
                      {...register('email')}
                      className='w-full px-4 py-3 pl-11 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all'
                      placeholder='you@company.com'
                    />
                    <Mail className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                  </div>
                  {errors.email && <InputErrorWrapper message={errors.email.message || ''} />}
                </div>

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
                      Sending...
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </button>
              </form>

              <div className='mt-8 text-center'>
                <Link
                  href='/login'
                  className='inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors'
                >
                  <ArrowLeft className='h-4 w-4' />
                  Back to login
                </Link>
              </div>
            </>
          )}

          <div className='mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground'>
            <Shield className='h-4 w-4' />
            <span>Protected by 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
