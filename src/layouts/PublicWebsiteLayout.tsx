'use client'
import React, { useState, useEffect } from 'react'
import PublicHeader from '../components/public/PublicHeader'
import PublicFooter from '../components/public/PublicFooter'
import { useAppSelector } from '@/store/hooks'
import { useRouter } from 'next/navigation'

type PublicPage = 'home' | 'features' | 'pricing' | 'about' | 'contact' | 'login' | 'signup'

interface PublicWebsiteProps {
  children?: React.ReactNode
}

const PublicWebsiteLayout: React.FC<PublicWebsiteProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PublicPage>('home')
  const router = useRouter()

  const handlePageChange = (page: PublicPage) => {
    setCurrentPage(page)
  }
  const { isAuthenticated } = useAppSelector(state => state.authReducer)

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  return (
    <div className='flex flex-col min-h-screen bg-muted text-foreground'>
      <PublicHeader activePage={currentPage} handlePageChange={handlePageChange} />
      <main className='grow'>{children}</main>
      <PublicFooter handlePageChange={handlePageChange} />
    </div>
  )
}

export default PublicWebsiteLayout
