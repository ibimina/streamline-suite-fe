import { AccentColor } from '@/types'

const ACCENT_COLORS: Record<AccentColor, string> = {
  teal: '#14b8a6',
  blue: '#3b82f6',
  crimson: '#dc2626',
  slate: '#475569',
  purple: '#8b5cf6',
  emerald: '#10b981',
  orange: '#f97316',
  pink: '#ec4899',
  indigo: '#6366f1',
  amber: '#f59e0b',
}

enum CUSTOMER_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

const PORTAL_BASE_PATH = '/customer-portal'

// ========== FORMATTING UTILITIES ==========

/**
 * Format a date to a localized string (Nigerian locale)
 */
const formatDate = (date: string | Date | undefined): string => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format a number as currency.
 * @param amount  – value to format
 * @param currency – ISO 4217 code (default: 'NGN')
 * @param locale – BCP 47 locale tag (default: 'en-NG')
 */
const formatCurrency = (
  amount: number | undefined,
  currency: string = 'NGN',
  locale: string = 'en-NG'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0)
}

// ========== DEFAULT TERMS ==========

const DEFAULT_INVOICE_TERMS = `1. Payment is due within 30 days from the invoice date.
2. Late payments may incur additional charges.
3. All prices are exclusive of VAT unless otherwise stated.
4. Please include the invoice number as payment reference.`

const DEFAULT_QUOTATION_TERMS = `1. This quotation is valid for 30 days from the date of issue.
2. Payment terms: Net 30 days.
3. All prices are exclusive of VAT unless otherwise stated.
4. Acceptance of this quotation constitutes agreement to our terms and conditions.`

// ========== STATUS CONFIGURATIONS ==========

type StatusConfig = { color: string; icon: string; bg: string }

const INVOICE_STATUS_CONFIG: Record<string, StatusConfig> = {
  draft: { color: 'text-secondary-foreground', icon: '📝', bg: 'bg-muted ' },
  sent: { color: 'text-blue-700', icon: '📤', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  paid: { color: 'text-green-700', icon: '✅', bg: 'bg-green-100 dark:bg-green-900/30' },
  partial: { color: 'text-yellow-700', icon: '⏳', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  overdue: { color: 'text-red-700', icon: '⚠️', bg: 'bg-red-100 dark:bg-red-900/30' },
  cancelled: { color: 'text-secondary-foreground', icon: '❌', bg: 'bg-muted ' },
}

const QUOTATION_STATUS_CONFIG: Record<string, StatusConfig> = {
  draft: { color: 'text-secondary-foreground', icon: '📝', bg: 'bg-muted ' },
  sent: { color: 'text-blue-700', icon: '📤', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  viewed: { color: 'text-purple-700', icon: '👁️', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  accepted: { color: 'text-green-700', icon: '✅', bg: 'bg-green-100 dark:bg-green-900/30' },
  rejected: { color: 'text-red-700', icon: '❌', bg: 'bg-red-100 dark:bg-red-900/30' },
  expired: { color: 'text-orange-700', icon: '⏰', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  converted: { color: 'text-primary', icon: '🔄', bg: 'bg-primary-light dark:bg-primary/20/30' },
}

/**
 * Get status config for invoices
 */
const getInvoiceStatusConfig = (status?: string): StatusConfig => {
  return INVOICE_STATUS_CONFIG[status?.toLowerCase() || 'draft'] || INVOICE_STATUS_CONFIG.draft
}

/**
 * Get status config for quotations
 */
const getQuotationStatusConfig = (status?: string): StatusConfig => {
  return QUOTATION_STATUS_CONFIG[status?.toLowerCase() || 'draft'] || QUOTATION_STATUS_CONFIG.draft
}

// ========== DEFAULT VALUES ==========

const DEFAULT_VAT_RATE = 7.5

export {
  ACCENT_COLORS,
  CUSTOMER_STATUS,
  PORTAL_BASE_PATH,
  formatDate,
  formatCurrency,
  DEFAULT_INVOICE_TERMS,
  DEFAULT_QUOTATION_TERMS,
  INVOICE_STATUS_CONFIG,
  QUOTATION_STATUS_CONFIG,
  getInvoiceStatusConfig,
  getQuotationStatusConfig,
  DEFAULT_VAT_RATE,
}
