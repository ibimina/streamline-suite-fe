'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MenuIcon } from '../Icons'
import { useAppSelector } from '../../store/hooks'
import { useLogoutMutation } from '@/store/api'
import Image from 'next/image'
import { Bell, Search, Settings, User, LogOut, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

interface HeaderProps {
  toggleMobileSidebar: () => void
}

const Header: React.FC<HeaderProps> = ({ toggleMobileSidebar }) => {
  const { user } = useAppSelector(state => state.authReducer)
  const router = useRouter()
  const [logout] = useLogoutMutation()
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results or filter current page
      console.warn('Searching for:', searchQuery)
    }
  }

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

        {/* Search Bar - Hidden on mobile */}
        <form onSubmit={handleSearch} className='hidden md:flex flex-1 max-w-md ml-4'>
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search invoices, customers...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-9 h-9'
            />
          </div>
        </form>

        {/* Right side actions */}
        <div className='flex items-center space-x-3 ml-auto'>
          {/* Mobile search button */}
          <button
            className='md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors'
            aria-label='Search'
          >
            <Search className='h-5 w-5' />
          </button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className='relative p-2 text-muted-foreground hover:text-foreground transition-colors'
                aria-label='Notifications'
              >
                <Bell className='h-5 w-5' />
                {/* Notification badge - show when there are unread notifications */}
                <span className='absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-80'>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className='py-6 text-center text-sm text-muted-foreground'>
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className='h-8 w-px bg-border hidden sm:block' />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='flex items-center space-x-2 hover:opacity-80 transition-opacity'>
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
                    <span className='text-muted-foreground font-semibold text-sm'>
                      {user?.account?.name?.substring(0, 2).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}

                <div className='hidden sm:flex flex-col items-start'>
                  <span className='font-semibold text-foreground text-sm'>
                    {user?.account?.name || 'Account'}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
                  </span>
                </div>

                <ChevronDown className='h-4 w-4 text-muted-foreground hidden sm:block' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel>
                <div className='flex flex-col'>
                  <span>{`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}</span>
                  <span className='text-xs font-normal text-muted-foreground'>
                    {user?.email || ''}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <User className='mr-2 h-4 w-4' />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className='mr-2 h-4 w-4' />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className='text-destructive focus:text-destructive'
              >
                <LogOut className='mr-2 h-4 w-4' />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Header
