'use client'

import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Custom fallback UI */
  fallback?: ReactNode
  /** Called when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  /** Show reset button */
  showReset?: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary component for catching and handling React errors gracefully.
 * Displays a user-friendly fallback UI when an error occurs in child components.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  handleRefresh = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className='flex flex-col items-center justify-center min-h-100 py-12 px-4 text-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-destructive-light mb-6'>
            <AlertTriangle className='h-8 w-8 text-destructive' />
          </div>

          <h2 className='text-xl font-semibold text-foreground mb-2'>Something went wrong</h2>

          <p className='text-muted-foreground max-w-md mb-6'>
            We encountered an unexpected error. Please try refreshing the page or contact support if
            the problem persists.
          </p>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className='mb-6 w-full max-w-lg'>
              <summary className='cursor-pointer text-sm text-muted-foreground hover:text-foreground'>
                View error details
              </summary>
              <pre className='mt-2 p-4 bg-muted rounded-lg text-left text-xs overflow-auto max-h-40'>
                {this.state.error.message}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}

          <div className='flex gap-3'>
            {this.props.showReset !== false && (
              <Button variant='outline' onClick={this.handleReset}>
                Try Again
              </Button>
            )}
            <Button onClick={this.handleRefresh}>
              <RefreshCw className='h-4 w-4 mr-2' />
              Refresh Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

/**
 * HOC to wrap a component with ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  const ComponentWithErrorBoundary = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  )

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`

  return ComponentWithErrorBoundary
}
