import { z } from 'zod'

/**
 * Payroll Form Schema
 * For creating new payroll runs
 */
export const payrollSchema = z
  .object({
    payPeriodStart: z
      .string()
      .min(1, 'Pay period start date is required')
      .refine(
        val => {
          const date = new Date(val)
          return !Number.isNaN(date.getTime())
        },
        { message: 'Invalid date format' }
      ),
    payPeriodEnd: z
      .string()
      .min(1, 'Pay period end date is required')
      .refine(
        val => {
          const date = new Date(val)
          return !Number.isNaN(date.getTime())
        },
        { message: 'Invalid date format' }
      ),
    paymentDate: z
      .string()
      .min(1, 'Payment date is required')
      .refine(
        val => {
          const date = new Date(val)
          return !Number.isNaN(date.getTime())
        },
        { message: 'Invalid date format' }
      ),
    notes: z
      .string()
      .max(500, 'Notes must be less than 500 characters')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    data => {
      const start = new Date(data.payPeriodStart)
      const end = new Date(data.payPeriodEnd)
      return start <= end
    },
    {
      message: 'Pay period end must be after pay period start',
      path: ['payPeriodEnd'],
    }
  )

/**
 * Type inference for form data
 */
export type PayrollFormData = z.infer<typeof payrollSchema>
