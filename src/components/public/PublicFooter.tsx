'use client'
import React from 'react'
import Link from 'next/link'
import { Zap, Mail, Phone, MapPin } from 'lucide-react'
import Logo from '../shared/Logo'

const PublicFooter = () => {
  return (
    <footer className='bg-card border-t border-border'>
      <div className='mx-auto max-w-7xl px-6 py-16 lg:px-8'>
        <div className='grid md:grid-cols-4 gap-12'>
          {/* Brand */}
          <div className='md:col-span-1'>
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-8 h-8 rounded-lg bg-primary flex items-center justify-center'>
                <Logo variant='light' className='h-6 w-6' />
              </div>
              <span className='text-xl font-bold text-foreground'>Streamline</span>
            </div>
            <p className='text-sm text-muted-foreground mb-6'>
              The all-in-one business management platform for African entrepreneurs.
            </p>
            <div className='flex gap-4'>
              {['twitter', 'linkedin', 'facebook', 'instagram'].map(social => (
                <a
                  key={social}
                  href={`#${social}`}
                  className='w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors'
                >
                  <span className='sr-only'>{social}</span>
                  <div className='w-4 h-4' />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className='font-semibold text-foreground mb-4'>Product</h4>
            <ul className='space-y-3'>
              {['Features', 'Pricing', 'Integrations', 'Updates'].map(link => (
                <li key={link}>
                  <a
                    href='#'
                    className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='font-semibold text-foreground mb-4'>Company</h4>
            <ul className='space-y-3'>
              {['About', 'Blog', 'Careers', 'Press'].map(link => (
                <li key={link}>
                  <a
                    href='#'
                    className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='font-semibold text-foreground mb-4'>Contact</h4>
            <ul className='space-y-3'>
              <li className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Mail className='w-4 h-4' />
                hello@streamlinesuite.com
              </li>
              <li className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Phone className='w-4 h-4' />
                +234 800 000 0000
              </li>
              <li className='flex items-start gap-2 text-sm text-muted-foreground'>
                <MapPin className='w-4 h-4 mt-0.5' />
                Lagos, Nigeria
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-sm text-muted-foreground'>
            © 2026 Streamline Suite. All rights reserved.
          </p>
          <div className='flex gap-6'>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
              <a
                key={link}
                href='#'
                className='text-sm text-muted-foreground hover:text-foreground transition-colors'
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PublicFooter
