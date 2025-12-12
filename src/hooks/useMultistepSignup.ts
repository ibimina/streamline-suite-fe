import { useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { stepSchemas } from '@/schemas/signup.schema'
import {
  CompanyInfoFormData,
  AdminAccountFormData,
  SecurityFormData,
  SignupFormData,
} from '@/types/signup.types'

export type StepData = CompanyInfoFormData | AdminAccountFormData | SecurityFormData

export interface UseMultistepSignupReturn {
  currentStep: number
  totalSteps: number
  formMethods: UseFormReturn<SignupFormData>
  isFirstStep: boolean
  isLastStep: boolean
  nextStep: () => Promise<boolean>
  prevStep: () => void
  goToStep: (step: number) => void
  submitForm: () => Promise<void>
  isSubmitting: boolean
  completedSteps: Set<number>
  errors: Record<string, string>
}

export const useMultistepSignup = (
  onSubmit: (data: SignupFormData) => Promise<void>
): UseMultistepSignupReturn => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalSteps = stepSchemas.length

  const formMethods = useForm<SignupFormData>({
    resolver: zodResolver(stepSchemas[currentStep]) as any,
    mode: 'onChange',
    defaultValues: {
      name: '',
      address: '',
      industry: '',
      companySize: '',
      country: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      agreeToPrivacy: false,
    },
  })

  const { trigger, getValues, handleSubmit } = formMethods

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  const validateCurrentStep = async (): Promise<boolean> => {
    const result = await trigger()
    if (!result) {
      setErrors(formMethods.formState.errors as Record<string, any>)
      return false
    }
    setErrors({})
    return true
  }

  const nextStep = async (): Promise<boolean> => {
    const isValid = await validateCurrentStep()

    if (isValid && currentStep < totalSteps - 1) {
      setCompletedSteps(prev => new Set(prev).add(currentStep))
      setCurrentStep(prev => prev + 1)

      // Update resolver for next step
      formMethods.clearErrors()

      return true
    }
    return false
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      formMethods.clearErrors()
      setErrors({})
    }
  }

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step)
      formMethods.clearErrors()
      setErrors({})
    }
  }

  const submitForm = async (): Promise<void> => {
    setIsSubmitting(true)
    try {
      const isValid = await validateCurrentStep()
      if (!isValid) {
        setIsSubmitting(false)
        return
      }

      const formData = getValues()
      await onSubmit(formData)
      setCompletedSteps(prev => new Set(prev).add(currentStep))
    } catch (error) {
      console.error('Signup error:', error)
      setErrors({ submit: 'An error occurred during signup. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    currentStep,
    totalSteps,
    formMethods,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
    isSubmitting,
    completedSteps,
    errors,
  }
}
