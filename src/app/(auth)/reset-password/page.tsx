import { Suspense } from 'react'
import ResetPasswordContent, { ResetPasswordLoading } from './ResetPasswordContent'

// Force dynamic rendering for useSearchParams
export const dynamic = 'force-dynamic'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
