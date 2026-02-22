'use client'
import Header from '@/components/shared/Header'
import Sidebar from '@/components/shared/Sidebar'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { setMobileSidebarOpen } from '@/store/slices/uiSlice'

interface PublicWebsiteProps {
  children?: React.ReactNode
}

const DashboardLayout: React.FC<PublicWebsiteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector(state => state.authReducer)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isMobileSidebarOpen } = useAppSelector(state => state.ui)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // if (!isAuthenticated) {
  //     return null;
  // }

  return (
    <div className='flex h-screen bg-muted dark:bg-background text-foreground'>
      <Sidebar />
      <div className='flex flex-col flex-1 min-w-0 overflow-hidden'>
        <Header toggleMobileSidebar={() => dispatch(setMobileSidebarOpen(!isMobileSidebarOpen))} />
        <main className='flex-1 overflow-y-auto'>
          <div className='container mx-auto px-6 py-8'>{children}</div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
