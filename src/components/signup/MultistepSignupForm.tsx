import React from 'react'
import { FormProvider } from 'react-hook-form'
import { useAppDispatch } from '@/store/hooks'
import { useMultistepSignup } from '@/hooks/useMultistepSignup'
import StepProgress from './StepProgress'
import CompanyInfoStep from './CompanyInfoStep'
import AdminAccountStep from './AdminAccountStep'
import SecurityStep from './SecurityStep'
import { SignupFormData } from '@/types/signup.types'
import { createNewAccountAction } from '@/store/slices/auth/actions'
import { toast } from 'react-toastify'

interface MultistepSignupFormProps {
  onSuccess?: () => void
}

const MultistepSignupForm: React.FC<MultistepSignupFormProps> = ({ onSuccess }) => {
  const dispatch = useAppDispatch()

  const handleSubmit = async (data: SignupFormData): Promise<void> => {
    try {
      // Dispatch successful signup
      const {
        password,
        firstName,
        lastName,
        email,
        name,
        phoneNumber,
        address,
        industry,
        companySize,
        country,
      } = data
      await dispatch(
        createNewAccountAction({
          password,
          firstName,
          lastName,
          email,
          name,
          phoneNumber,
          address,
          industry,
          companySize,
          country,
        })
      )
      onSuccess?.()
    } catch (error) {
      console.error('Signup failed:', error)
      toast.error('Signup failed. Please try again.')
      // throw new Error('Failed to create account. Please try again.')
    }
  }

  const {
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
  } = useMultistepSignup(handleSubmit)

  const stepComponents = [
    <CompanyInfoStep key='company' formMethods={formMethods} />,
    <AdminAccountStep key='admin' formMethods={formMethods} />,
    <SecurityStep key='security' formMethods={formMethods} />,
  ]

  const handleNext = async () => {
    const success = await nextStep()
    if (!success) {
      // Scroll to first error
      const firstError = document.querySelector('[role="alert"]')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  const handleSubmitStep = async () => {
    await submitForm()
  }

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white'>
          Create your account
        </h1>
        <p className='mt-2 text-gray-600 dark:text-gray-400'>
          Join Streamline Suite to manage your business efficiently
        </p>
      </div>

      <div className='bg-white dark:bg-gray-800 shadow-xl rounded-lg'>
        <div className='px-6 py-8'>
          <StepProgress
            currentStep={currentStep}
            totalSteps={totalSteps}
            completedSteps={completedSteps}
            onStepClick={goToStep}
          />

          <FormProvider {...formMethods}>
            <form className='space-y-8'>
              {/* Current Step Component */}
              <div className='min-h-[400px]'>{stepComponents[currentStep]}</div>

              {/* Global Errors */}
              {errors.submit && (
                <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg'>
                  <div className='flex'>
                    <div className='shrink-0'>
                      <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm text-red-800 dark:text-red-200' role='alert'>
                        {errors.submit}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className='flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700'>
                <button
                  type='button'
                  onClick={prevStep}
                  disabled={isFirstStep}
                  className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  <svg
                    className='mr-2 h-4 w-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 19l-7-7 7-7'
                    />
                  </svg>
                  Previous
                </button>

                {isLastStep ? (
                  <button
                    type='button'
                    onClick={handleSubmitStep}
                    disabled={isSubmitting}
                    className='inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          />
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          />
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <svg
                          className='ml-2 h-4 w-4'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M5 13l4 4L19 7'
                          />
                        </svg>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type='button'
                    onClick={handleNext}
                    className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors'
                  >
                    Next
                    <svg
                      className='ml-2 h-4 w-4'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}

export default MultistepSignupForm
