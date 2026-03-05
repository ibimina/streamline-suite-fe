'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import MultistepSignupForm from '@/components/signup/MultistepSignupForm'
import Link from 'next/link'
import { Shield, Gift, Clock, CreditCard } from 'lucide-react'
import Logo from '@/components/shared/Logo'

const SignUpPage: React.FC = () => {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/dashboard')
  }

  return (
    <div className='min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='grid lg:grid-cols-5 gap-0 w-full max-w-6xl bg-card rounded-2xl shadow-2xl overflow-hidden border border-border'>
        {/* Left Side - Branding */}
        <div className='hidden lg:flex lg:col-span-2 flex-col justify-between p-10 bg-linear-to-br from-primary to-primary/80 text-white'>
          <div>
            <div className='flex items-center gap-2 mb-8'>
              <Logo variant='light' className='h-10 w-10' />
              <span className='text-2xl font-bold'>Streamline Suite</span>
            </div>
            <h2 className='text-3xl font-bold mb-4'>Start your free trial</h2>
            <p className='text-white/80 text-lg'>
              Join 5,000+ businesses already managing their operations smarter.
            </p>
          </div>

          <div className='space-y-5'>
            <div className='flex items-start gap-4'>
              <div className='p-2 bg-white/10 rounded-lg shrink-0'>
                <Gift className='h-5 w-5' />
              </div>
              <div>
                <h4 className='font-semibold'>14-Day Free Trial</h4>
                <p className='text-sm text-white/70'>Full access to all features</p>
              </div>
            </div>
            <div className='flex items-start gap-4'>
              <div className='p-2 bg-white/10 rounded-lg shrink-0'>
                <CreditCard className='h-5 w-5' />
              </div>
              <div>
                <h4 className='font-semibold'>No Credit Card Required</h4>
                <p className='text-sm text-white/70'>Start immediately, upgrade later</p>
              </div>
            </div>
            <div className='flex items-start gap-4'>
              <div className='p-2 bg-white/10 rounded-lg shrink-0'>
                <Clock className='h-5 w-5' />
              </div>
              <div>
                <h4 className='font-semibold'>Setup in 5 Minutes</h4>
                <p className='text-sm text-white/70'>Quick onboarding, instant results</p>
              </div>
            </div>
            <div className='flex items-start gap-4'>
              <div className='p-2 bg-white/10 rounded-lg shrink-0'>
                <Shield className='h-5 w-5' />
              </div>
              <div>
                <h4 className='font-semibold'>Cancel Anytime</h4>
                <p className='text-sm text-white/70'>No long-term commitments</p>
              </div>
            </div>
          </div>

          <p className='text-sm text-white/60'>© 2026 Streamline Suite. All rights reserved.</p>
        </div>

        {/* Right Side - Form */}
        <div className='lg:col-span-3 p-6 sm:p-8 flex flex-col justify-center'>
          <div className='lg:hidden mb-6 flex items-center gap-2'>
            <Logo className='h-8 w-8' />
            <span className='text-xl font-bold text-foreground'>Streamline Suite</span>
          </div>

          <MultistepSignupForm onSuccess={handleSuccess} />

          <div className='mt-6 text-center'>
            <p className='text-sm text-muted-foreground'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='font-semibold text-primary hover:text-primary/80 transition-colors'
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className='mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground'>
            <Shield className='h-4 w-4' />
            <span>Your data is protected with 256-bit encryption</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
