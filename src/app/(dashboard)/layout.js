import { Geist, Geist_Mono } from 'next/font/google'
import DashboardLayout from '@/layouts/DashboardLayout'
import ReduxProvider from '@/providers/ReduxProvider'
import ThemeProvider from '@/providers/ThemeProvider'
import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Streamline Suite - Dashboard',
  description: 'Comprehensive business management platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <ThemeProvider>
            <DashboardLayout>{children}</DashboardLayout>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
