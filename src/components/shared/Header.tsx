'use client'
import React from 'react'
import { MenuIcon } from '../Icons'
import { useAppSelector } from '../../store/hooks'
import Image from 'next/image'

interface HeaderProps {
  toggleMobileSidebar: () => void
}

const Header: React.FC<HeaderProps> = ({ toggleMobileSidebar }) => {
  const { user } = useAppSelector(state => state.authReducer)

  return (
    <header className='bg-card border-b border-border shadow-sm z-20 shrink-0'>
      <div className='flex items-center p-4 h-16'>
        {/* Mobile menu button */}
        <button
          onClick={toggleMobileSidebar}
          className='text-muted-foreground focus:outline-none md:hidden hover:text-foreground transition-colors'
          aria-label='Open sidebar'
        >
          <MenuIcon className='h-6 w-6' />
        </button>

        {/* Company and User Details - pushed to the right with ml-auto */}
        <div className='flex items-center space-x-4 ml-auto'>
          <div className='h-8 w-px bg-border hidden sm:block'></div>

          <div className='flex items-center space-x-2'>
            {user?.account?.logoUrl ? (
              <Image
                src={user?.account?.logoUrl}
                alt={user.account.name}
                className='h-8 w-8 rounded-full'
                width={32}
                height={32}
              />
            ) : (
              <div className='h-8 w-8 rounded-full bg-muted flex items-center justify-center'>
                <span className='text-muted-foreground font-semibold'>
                  {user?.account.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}

            <div className='flex flex-col'>
              <span className='hidden sm:inline font-semibold text-foreground'>
                {user?.account.name}
              </span>

              <span className='hidden sm:inline font-semibold text-foreground'>
                {`${user?.firstName || ''} ${user?.lastName || ''}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
