import { Geist, Geist_Mono } from 'next/font/google'
import PublicWebsiteLayout from '@/layouts/PublicWebsiteLayout'
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
  title: 'Streamline Suite - Authentication',
  description: 'Login and signup for Streamline Suite',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <ThemeProvider>
            <PublicWebsiteLayout>{children}</PublicWebsiteLayout>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
