import DashboardLayout from '@/layouts/DashboardLayout'
import ReduxProvider from '@/providers/ReduxProvider'
import '../globals.css'

export const metadata = {
  title: 'Streamline Suite - Dashboard',
  description: 'Comprehensive business management platform',
}

export default function RootLayout({ children }) {
  return (
    <ReduxProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ReduxProvider>
  )
}
