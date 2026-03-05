'use client'

import React from 'react'
import Link from 'next/link'
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react'
import Logo from '@/components/shared/Logo'

const NotFoundPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-linear-to-b from-background to-muted/30 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-2xl text-center'>
        {/* Logo */}
        <div className='flex items-center gap-2 justify-center mb-12'>
          <Logo className='h-10 w-10' />
          <span className='text-2xl font-bold text-foreground'>Streamline Suite</span>
        </div>

        {/* 404 Illustration */}
        <div className='relative mb-8'>
          <div className='text-[180px] sm:text-[220px] font-black text-primary/10 leading-none select-none'>
            404
          </div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='bg-card rounded-2xl shadow-2xl border border-border p-8 backdrop-blur-sm'>
              <Search className='h-16 w-16 text-primary mx-auto' />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className='text-3xl sm:text-4xl font-bold text-foreground mb-4'>Page not found</h1>
        <p className='text-lg text-muted-foreground mb-10 max-w-md mx-auto'>
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved,
          deleted, or never existed.
        </p>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
          <Link
            href='/'
            className='inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-all w-full sm:w-auto'
          >
            <Home className='h-5 w-5' />
            Go to homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className='inline-flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border text-foreground font-semibold rounded-lg shadow-sm hover:bg-muted/50 transition-all w-full sm:w-auto'
          >
            <ArrowLeft className='h-5 w-5' />
            Go back
          </button>
        </div>

        {/* Help Link */}
        <div className='mt-12 pt-8 border-t border-border'>
          <p className='text-muted-foreground mb-4'>Need help?</p>
          <div className='flex items-center justify-center gap-6'>
            <Link
              href='/contact-us'
              className='inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors'
            >
              <HelpCircle className='h-4 w-4' />
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
