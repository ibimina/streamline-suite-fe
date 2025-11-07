import DashboardLayout from '@/layouts/DashboardLayout'
import '../globals.css'

export const metadata = {
  title: 'Streamline Suite - Dashboard',
  description: 'Comprehensive business management platform',
}

export default function RootLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
