'use client'
import React from 'react'
import Link from 'next/link'

type PublicPage = 'home' | 'features' | 'about' | 'contact' | 'login' | 'signup'

const FooterLink: React.FC<{
  page: PublicPage
  handlePageChange: (page: PublicPage) => void
  children: React.ReactNode
}> = ({ page, handlePageChange, children }) => {
  return (
    <Link
      href={`/${page}`}
      onClick={() => {
        handlePageChange(page)
      }}
      className='text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
    >
      {children}
    </Link>
  )
}

const PublicFooter = ({ handlePageChange }: { handlePageChange: (page: PublicPage) => void }) => {
  const navItems: { page: PublicPage; label: string }[] = [
    { page: 'features', label: 'Features' },
    { page: 'about', label: 'About' },
    { page: 'contact', label: 'Contact' },
  ]

  return (
    <footer className='bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700'>
      <div className='mx-auto max-w-7xl overflow-hidden px-6 py-12 lg:px-4 lg:py-4'>
        <nav
          className='-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12'
          aria-label='Footer'
        >
          {navItems.map(item => (
            <div key={item.label} className='pb-6'>
              <FooterLink page={item.page} handlePageChange={handlePageChange}>
                {item.label}
              </FooterLink>
            </div>
          ))}
        </nav>
        <p className='mt-3 text-center text-xs leading-5 text-gray-500 dark:text-gray-400'>
          &copy; {new Date().getFullYear()} Streamline Suite, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default PublicFooter
