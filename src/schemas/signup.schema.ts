import { z } from 'zod'

// Step 1: Company Information
export const companyInfoSchema = z.object({
  name: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .trim(),
  address: z.string().min(5, 'Please enter a valid address'),
  industry: z.string().min(1, 'Please select an industry'),
  companySize: z.string().min(1, 'Please select company size'),
  country: z.string().min(1, 'Please select a country'),
})

// Step 2: Admin Account
export const adminAccountSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .trim(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .trim(),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  phoneNumber: z.string().refine(
    val => {
      if (!val) return true // Optional field
      // Basic E.164 format validation (starts with +, followed by 1-15 digits)
      return /^\+[1-9]\d{1,14}$/.test(val)
    },
    {
      message: 'Please enter a valid phone number with country code',
    }
  ),
})

// Step 3: Security
export const securitySchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine(val => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
    agreeToPrivacy: z.boolean().refine(val => val === true, {
      message: 'You must agree to the privacy policy',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Combined schema for full signup
export const signupSchema = z.object({
  ...companyInfoSchema.shape,
  ...adminAccountSchema.shape,
  ...securitySchema.shape,
})

// Type definitions
// export type CompanyInfoFormData = z.infer<typeof companyInfoSchema>
// export type AdminAccountFormData = z.infer<typeof adminAccountSchema>
// export type SecurityFormData = z.infer<typeof securitySchema>
// export type SignupFormData = z.infer<typeof signupSchema>

// Step validation schemas
export const stepSchemas = [companyInfoSchema, adminAccountSchema, securitySchema] as const

// Industry options
export const industryOptions = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Real Estate',
  'Construction',
  'Food & Beverage',
  'Professional Services',
  'Non-profit',
  'Other',
] as const

// Company size options
export const companySizeOptions = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees',
] as const

// Country options (simplified list)
export const countryOptions = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Netherlands',
  'Nigeria',
  'South Africa',
  'India',
  'Singapore',
  'Other',
] as const
