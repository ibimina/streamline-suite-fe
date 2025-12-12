import { z } from 'zod'

// Step 1: Company Information
export const loginSchema = z.object({
  email: z.email('Enter your email').trim(),
  password: z.string().min(1, 'Enter your password').trim(),
})
