'use client'
import React, { useState } from 'react'
import Logo from '../Logo'
import { MenuIcon, XIcon } from '../Icons'
import Link from 'next/link'

type PublicPage = 'home' | 'features' | 'pricing' | 'about' | 'contact' | 'login' | 'signup'

interface PublicHeaderProps {
  activePage: PublicPage
  handlePageChange: (page: PublicPage) => void
}

// Map page names to actual routes
const getRouteForPage = (page: PublicPage): string => {
  switch (page) {
    case 'home':
      return '/'
    case 'features':
      return '/features'
    case 'pricing':
      return '/pricing'
    case 'about':
      return '/about'
    case 'contact':
      return '/contact-us'
    case 'login':
      return '/login'
    case 'signup':
      return '/signup'
    default:
      return '/'
  }
}

const NavLink: React.FC<{
  page: PublicPage
  activePage: PublicPage
  children: React.ReactNode
  isMobile?: boolean
  setMobileMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>
  handlePageChange: (page: PublicPage) => void
}> = ({ page, activePage, children, isMobile = false, setMobileMenuOpen, handlePageChange }) => {
  const isActive = activePage === page
  const mobileClasses = 'block w-full text-left px-3 py-2 rounded-md text-base font-medium'
  const desktopClasses = 'text-sm font-semibold leading-6'
  const commonClasses = isMobile ? mobileClasses : desktopClasses

  return (
    <Link
      href={getRouteForPage(page)}
      onClick={() => {
        handlePageChange(page)
        if (isMobile) {
          setMobileMenuOpen?.(false)
        }
      }}
      className={`${commonClasses} ${
        isActive
          ? isMobile
            ? 'bg-teal-600 text-white'
            : 'text-teal-500'
          : isMobile
            ? 'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            : 'text-gray-700 dark:text-gray-200 hover:text-teal-500 dark:hover:text-teal-400'
      }`}
    >
      {children}
    </Link>
  )
}

const PublicHeader: React.FC<PublicHeaderProps> = ({ activePage, handlePageChange }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems: { page: PublicPage; label: string }[] = [
    { page: 'home', label: 'Home' },
    { page: 'features', label: 'Features' },
    { page: 'pricing', label: 'Pricing' },
    { page: 'about', label: 'About Us' },
    { page: 'contact', label: 'Contact' },
  ]

  return (
    <>
      <header className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-50'>
        <nav
          className='mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8'
          aria-label='Global'
        >
          <div className='flex lg:flex-1'>
            <Link
              href='/'
              onClick={() => handlePageChange('home')}
              className='-m-1.5 p-1.5 flex items-center'
            >
              <span className='sr-only'>Streamline Suite</span>
              <Logo className='h-8 w-auto' />
              <span className='ml-2 text-xl font-bold text-gray-900 dark:text-white'>
                Streamline Suite
              </span>
            </Link>
          </div>
          <div className='flex lg:hidden'>
            <button
              type='button'
              onClick={() => setMobileMenuOpen(true)}
              className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-400'
            >
              <span className='sr-only'>Open main menu</span>
              <MenuIcon className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <div className='hidden lg:flex lg:gap-x-12'>
            {navItems.map(item => (
              <NavLink
                key={item.page}
                page={item.page}
                activePage={activePage}
                handlePageChange={handlePageChange}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className='hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4'>
            <Link
              href='/login'
              onClick={() => handlePageChange('login')}
              className='text-sm font-semibold leading-6 text-gray-700 dark:text-gray-200 hover:text-teal-500 dark:hover:text-teal-400'
            >
              Log in
            </Link>
            <Link
              href='/signup'
              onClick={() => handlePageChange('signup')}
              className='rounded-md bg-teal-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-600  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600'
            >
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className='lg:hidden' role='dialog' aria-modal='true'>
          <div className='fixed inset-0 z-50' />
          <div className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
            <div className='flex items-center justify-between'>
              <Link
                href='/'
                onClick={() => handlePageChange('home')}
                className='-m-1.5 p-1.5 flex items-center'
              >
                <span className='sr-only'>Streamline Suite</span>
                <Logo className='h-8 w-auto' />
                <span className='ml-2 text-xl font-bold'>Streamline Suite</span>
              </Link>
              <button
                type='button'
                onClick={() => setMobileMenuOpen(false)}
                className='-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-400'
              >
                <span className='sr-only'>Close menu</span>
                <XIcon className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>
            <div className='mt-6 flow-root'>
              <div className='-my-6 divide-y divide-gray-500/10'>
                <div className='space-y-2 py-6'>
                  {navItems.map(item => (
                    <NavLink
                      key={item.page}
                      page={item.page}
                      activePage={activePage}
                      setMobileMenuOpen={setMobileMenuOpen}
                      handlePageChange={handlePageChange}
                      isMobile
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
                <div className='py-6'>
                  <Link
                    href='/login'
                    onClick={() => {
                      handlePageChange('login')
                      setMobileMenuOpen(false)
                    }}
                    className='-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  >
                    Log in
                  </Link>
                  <Link
                    href='/signup'
                    onClick={() => {
                      handlePageChange('signup')
                      setMobileMenuOpen(false)
                    }}
                    className='mt-2 -mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white bg-teal-500 hover:bg-teal-600'
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PublicHeader
