import PublicWebsiteLayout from '@/layouts/PublicWebsiteLayout'

import '../globals.css'

export const metadata = {
  title: 'Streamline Suite - Authentication',
  description: 'Login and signup for Streamline Suite',
}

export default function RootLayout({ children }) {
  return <PublicWebsiteLayout>{children}</PublicWebsiteLayout>
}
