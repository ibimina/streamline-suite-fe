'use client'

import { useCallback, useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'

/**
 * Maps country names to their primary ISO 4217 currency codes.
 * Mirrors the backend mapping in common/utils/currency.util.ts.
 */
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  Nigeria: 'NGN',
  'South Africa': 'ZAR',
  Kenya: 'KES',
  Ghana: 'GHS',
  Egypt: 'EGP',
  'United States': 'USD',
  Canada: 'CAD',
  Mexico: 'MXN',
  'United Kingdom': 'GBP',
  Germany: 'EUR',
  France: 'EUR',
  Italy: 'EUR',
  Spain: 'EUR',
  Netherlands: 'EUR',
  Belgium: 'EUR',
  Ireland: 'EUR',
  Portugal: 'EUR',
  Austria: 'EUR',
  Switzerland: 'CHF',
  Sweden: 'SEK',
  Norway: 'NOK',
  Denmark: 'DKK',
  Poland: 'PLN',
  India: 'INR',
  China: 'CNY',
  Japan: 'JPY',
  'South Korea': 'KRW',
  Indonesia: 'IDR',
  Malaysia: 'MYR',
  Singapore: 'SGD',
  Thailand: 'THB',
  Philippines: 'PHP',
  'United Arab Emirates': 'AED',
  'Saudi Arabia': 'SAR',
  Brazil: 'BRL',
  Australia: 'AUD',
  'New Zealand': 'NZD',
}

/**
 * Get the locale string best matching a given currency code.
 */
function getLocaleForCurrency(currencyCode: string): string {
  const map: Record<string, string> = {
    NGN: 'en-NG',
    USD: 'en-US',
    GBP: 'en-GB',
    EUR: 'de-DE',
    CAD: 'en-CA',
    AUD: 'en-AU',
    INR: 'en-IN',
    JPY: 'ja-JP',
    CNY: 'zh-CN',
    KRW: 'ko-KR',
    BRL: 'pt-BR',
    ZAR: 'en-ZA',
    KES: 'en-KE',
    GHS: 'en-GH',
    AED: 'ar-AE',
    SAR: 'ar-SA',
    SGD: 'en-SG',
    MYR: 'ms-MY',
    CHF: 'de-CH',
    SEK: 'sv-SE',
    NOK: 'nb-NO',
    DKK: 'da-DK',
    PLN: 'pl-PL',
    MXN: 'es-MX',
  }
  return map[currencyCode] || 'en-US'
}

/**
 * Hook that provides the account's currency code and a `formatCurrency` function
 * that formats amounts using the correct currency and locale.
 *
 * Resolution order:
 * 1. `account.currency`
 * 2. Derived from `account.country` using COUNTRY_CURRENCY_MAP
 * 3. Fallback to `'NGN'`
 */
export function useCurrency() {
  const account = useAppSelector(state => state.authReducer.user?.account)

  const currency = useMemo(() => {
    if (account?.currency) return account.currency
    if (account?.country) return COUNTRY_CURRENCY_MAP[account.country] || 'NGN'
    return 'NGN'
  }, [account?.currency, account?.country])

  const locale = useMemo(() => getLocaleForCurrency(currency), [currency])

  const formatCurrency = useCallback(
    (
      amount: number | undefined,
      options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
    ) => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: options?.minimumFractionDigits ?? 2,
        maximumFractionDigits: options?.maximumFractionDigits ?? 2,
      }).format(amount || 0)
    },
    [currency, locale]
  )

  return { currency, locale, formatCurrency }
}
