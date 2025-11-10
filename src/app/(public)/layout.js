import PublicWebsiteLayout from '@/layouts/PublicWebsiteLayout'
import ReduxProvider from '@/providers/ReduxProvider'
import '../globals.css'

export const metadata = {
  title: 'Streamline Suite',
  description: 'Comprehensive business management platform',
}

export default function RootLayout({ children }) {
  return <PublicWebsiteLayout>{children}</PublicWebsiteLayout>
}
