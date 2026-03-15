'use client'
import Header from '@/components/shared/Header'
import Sidebar from '@/components/shared/Sidebar'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import ErrorBoundary from '@/components/shared/ErrorBoundary'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { setMobileSidebarOpen } from '@/store/slices/uiSlice'
import { usePermissions } from '@/hooks/usePermissions'

interface PublicWebsiteProps {
  children?: React.ReactNode
}

const DashboardLayout: React.FC<PublicWebsiteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector(state => state.authReducer)
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { isMobileSidebarOpen } = useAppSelector(state => state.ui)
  const { canAccessPage, accessDeniedRedirect } = usePermissions()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Check route permissions after authentication
    if (isAuthenticated && pathname && !canAccessPage(pathname)) {
      router.push(accessDeniedRedirect)
    }
  }, [isAuthenticated, pathname, canAccessPage, accessDeniedRedirect, router])

  // if (!isAuthenticated) {
  //     return null;
  // }

  return (
    <div className='flex h-screen bg-muted dark:bg-background text-foreground'>
      <Sidebar />
      <div className='flex flex-col flex-1 min-w-0 overflow-hidden'>
        <Header toggleMobileSidebar={() => dispatch(setMobileSidebarOpen(!isMobileSidebarOpen))} />
        <main className='flex-1 overflow-y-auto'>
          <div className='container mx-auto px-6 py-8'>
            <Breadcrumbs className='mb-4' />
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
