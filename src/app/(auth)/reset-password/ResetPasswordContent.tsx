'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Lock, ArrowLeft, Shield, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import Logo from '@/components/shared/Logo'
import InputErrorWrapper from '@/components/shared/InputErrorWrapper'
import { ResetPasswordData, resetPasswordSchema } from '@/schemas/reset-password.schema'
import { useResetPasswordMutation } from '@/store/api/authApi'

// Loading fallback component
export const ResetPasswordLoading = () => (
  <div className='min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
    <div className='w-full max-w-md'>
      <div className='bg-card rounded-2xl shadow-2xl border border-border p-8 text-center'>
        <div className='flex items-center gap-2 justify-center mb-8'>
          <Logo className='h-8 w-8' />
          <span className='text-xl font-bold text-foreground'>Streamline Suite</span>
        </div>
        <div className='animate-pulse flex flex-col items-center'>
          <div className='w-16 h-16 bg-muted rounded-full mb-6'></div>
          <div className='h-6 w-48 bg-muted rounded mb-4'></div>
          <div className='h-4 w-64 bg-muted rounded'></div>
        </div>
      </div>
    </div>
  </div>
)

const ResetPasswordContent: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const password = watch('password', '')

  const getPasswordStrength = (pwd: string) => {
    let strength = 0
    if (pwd.length >= 8) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[a-z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(password)

  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return { label: 'Weak', color: 'bg-red-500' }
    if (passwordStrength <= 2) return { label: 'Fair', color: 'bg-orange-500' }
    if (passwordStrength <= 3) return { label: 'Good', color: 'bg-yellow-500' }
    if (passwordStrength <= 4) return { label: 'Strong', color: 'bg-green-500' }
    return { label: 'Very Strong', color: 'bg-green-600' }
  }

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token) return
    setErrorMessage('')
    try {
      await resetPassword({ token, newPassword: data.password }).unwrap()
      setIsSubmitted(true)
    } catch (error: any) {
      console.error('Reset password error:', error)
      const message = error?.data?.message || 'Failed to reset password. Please try again.'
      setErrorMessage(message)
    }
  }

  // If no token, show error state
  if (!token && !isSubmitted) {
    return (
      <div className='min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md'>
          <div className='bg-card rounded-2xl shadow-2xl border border-border p-8 text-center'>
            <div className='flex items-center gap-2 justify-center mb-8'>
              <Logo className='h-8 w-8' />
              <span className='text-xl font-bold text-foreground'>Streamline Suite</span>
            </div>

            <div className='inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-6'>
              <Lock className='h-8 w-8 text-red-600 dark:text-red-400' />
            </div>
            <h2 className='text-2xl font-bold text-foreground mb-2'>Invalid or expired link</h2>
            <p className='text-muted-foreground mb-8'>
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              href='/forgot-password'
              className='inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-all'
            >
              Request new link
            </Link>
            <div className='mt-6'>
              <Link
                href='/login'
                className='inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors'
              >
                <ArrowLeft className='h-4 w-4' />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
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
              <h2 className='text-2xl font-bold text-foreground mb-2'>Password reset!</h2>
              <p className='text-muted-foreground mb-8'>
                Your password has been successfully reset. You can now log in with your new
                password.
              </p>
              <Link
                href='/login'
                className='inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-all'
              >
                Continue to login
              </Link>
            </div>
          ) : (
            <>
              <div className='mb-8'>
                <h2 className='text-2xl font-bold text-foreground'>Set new password</h2>
                <p className='mt-2 text-muted-foreground'>
                  Create a strong password for your account
                </p>
              </div>

              {errorMessage && (
                <div className='mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg'>
                  <p className='text-sm text-red-600 dark:text-red-400'>{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-foreground mb-2'
                  >
                    New password
                  </label>
                  <div className='relative'>
                    <input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      className='w-full px-4 py-3 pl-11 pr-11 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all'
                      placeholder='Enter new password'
                    />
                    <Lock className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                    >
                      {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                    </button>
                  </div>
                  {errors.password && <InputErrorWrapper message={errors.password.message || ''} />}

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className='mt-2'>
                      <div className='flex items-center gap-2 mb-1'>
                        <div className='flex-1 h-1.5 bg-muted rounded-full overflow-hidden'>
                          <div
                            className={`h-full transition-all ${getStrengthLabel().color}`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          />
                        </div>
                        <span className='text-xs text-muted-foreground'>
                          {getStrengthLabel().label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='confirmPassword'
                    className='block text-sm font-medium text-foreground mb-2'
                  >
                    Confirm new password
                  </label>
                  <div className='relative'>
                    <input
                      id='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      className='w-full px-4 py-3 pl-11 pr-11 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all'
                      placeholder='Confirm new password'
                    />
                    <Lock className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                    >
                      {showConfirmPassword ? (
                        <EyeOff className='h-5 w-5' />
                      ) : (
                        <Eye className='h-5 w-5' />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <InputErrorWrapper message={errors.confirmPassword.message || ''} />
                  )}
                </div>

                <div className='bg-muted/50 rounded-lg p-4'>
                  <p className='text-sm font-medium text-foreground mb-2'>Password requirements:</p>
                  <ul className='text-sm text-muted-foreground space-y-1'>
                    <li
                      className={password.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}
                    >
                      • At least 8 characters
                    </li>
                    <li
                      className={/[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : ''}
                    >
                      • One uppercase letter
                    </li>
                    <li
                      className={/[a-z]/.test(password) ? 'text-green-600 dark:text-green-400' : ''}
                    >
                      • One lowercase letter
                    </li>
                    <li
                      className={/[0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : ''}
                    >
                      • One number
                    </li>
                  </ul>
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
                      Resetting...
                    </>
                  ) : (
                    'Reset password'
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

export default ResetPasswordContent
