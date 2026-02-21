import { AccentColor } from '@/types'

const ACCENT_COLORS: Record<AccentColor, string> = {
  teal: '#14B8A6',
  blue: '#3B82F6',
  crimson: '#DC2626',
  slate: '#64748B',
}

enum CUSTOMER_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

const PORTAL_BASE_PATH = '/customer-portal'
export { ACCENT_COLORS, CUSTOMER_STATUS, PORTAL_BASE_PATH }
