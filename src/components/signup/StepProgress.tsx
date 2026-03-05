import React from 'react'

interface StepProgressProps {
  currentStep: number
  totalSteps: number
  completedSteps: Set<number>
  onStepClick?: (step: number) => void
  stepTitles?: string[]
}

const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  totalSteps,
  completedSteps,
  onStepClick,
  stepTitles = ['Company Info', 'Admin Account', 'Security'],
}) => {
  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.has(stepIndex)) return 'completed'
    if (stepIndex === currentStep) return 'current'
    if (stepIndex < currentStep) return 'completed'
    return 'upcoming'
  }

  const getStepClasses = (stepIndex: number) => {
    const status = getStepStatus(stepIndex)
    const baseClasses =
      'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors'

    switch (status) {
      case 'completed':
        return `${baseClasses} bg-primary text-white`
      case 'current':
        return `${baseClasses} bg-primary-light border-2 border-primary text-primary dark:bg-primary/20 dark:text-primary`
      default:
        return `${baseClasses} bg-muted text-muted-foreground  dark:text-muted-foreground`
    }
  }

  const getConnectorClasses = (stepIndex: number) => {
    const isCompleted = completedSteps.has(stepIndex) || stepIndex < currentStep
    return `flex-auto border-t-2 transition-colors ${
      isCompleted ? 'border-primary' : 'border-border'
    }`
  }

  return (
    <nav aria-label='Progress' className='mb-8'>
      <ol className='flex items-center'>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <li
            key={stepTitles[index]}
            className={`relative ${index !== totalSteps - 1 ? 'pr-8 sm:pr-20' : ''} flex-1`}
          >
            <div className='flex items-center'>
              <button
                onClick={() => onStepClick?.(index)}
                className={`${getStepClasses(index)} ${onStepClick ? 'hover:bg-primary-light dark:hover:bg-primary/10 cursor-pointer' : 'cursor-default'}`}
                aria-current={currentStep === index ? 'step' : undefined}
                disabled={!onStepClick}
              >
                {completedSteps.has(index) ? (
                  <svg className='w-5 h-5' viewBox='0 0 20 20' fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>

              <div className='ml-3 min-w-0'>
                <p
                  className={`text-sm font-medium ${
                    currentStep === index
                      ? 'text-primary dark:text-primary'
                      : completedSteps.has(index) || index < currentStep
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                  }`}
                >
                  {stepTitles[index]}
                </p>
                {currentStep === index && (
                  <p className='text-xs text-muted-foreground'>
                    Step {index + 1} of {totalSteps}
                  </p>
                )}
              </div>
            </div>

            {index !== totalSteps - 1 && (
              <div
                className={`${getConnectorClasses(index)} absolute top-4 left-8 -translate-y-1/2 translate-x-full`}
                aria-hidden='true'
              />
            )}
          </li>
        ))}
      </ol>

      {/* Progress bar */}
      <div className='mt-6'>
        <div className='bg-muted rounded-full h-2'>
          <div
            className='bg-primary h-2 rounded-full transition-all duration-300 ease-in-out'
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
        <div className='flex justify-between text-xs text-muted-foreground mt-2'>
          <span>0%</span>
          <span className='text-primary dark:text-primary font-medium'>
            {Math.round(((currentStep + 1) / totalSteps) * 100)}%
          </span>
          <span>100%</span>
        </div>
      </div>
    </nav>
  )
}

export default StepProgress
