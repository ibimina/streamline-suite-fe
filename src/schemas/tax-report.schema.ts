import { z } from 'zod'

/**
 * Tax Report Type Enum
 */
export const taxReportTypeEnum = z.enum(['sales_tax', 'purchase_tax', 'vat', 'withholding_tax'])

/**
 * Tax Report Generation Schema
 * For generating tax reports
 */
export const taxReportSchema = z.object({
  period: z
    .string()
    .min(1, 'Period is required')
    .max(50, 'Period must be less than 50 characters')
    .trim()
    .regex(
      /^(Q[1-4]\s+\d{4}|\d{4}|[A-Za-z]+\s+\d{4})$/,
      'Period should be in format: Q1 2024, 2024, or January 2024'
    ),
  type: taxReportTypeEnum.default('sales_tax'),
})

/**
 * Type inference for form data
 */
export type TaxReportFormData = z.infer<typeof taxReportSchema>
export type TaxReportType = z.infer<typeof taxReportTypeEnum>
