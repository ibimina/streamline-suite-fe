/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'

// Mock Next.js modules that might not be available in test environment
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Simple component for testing
const TestComponent = () => <div data-testid='test-component'>Hello, World!</div>

describe('Jest Configuration Tests', () => {
  it('should be properly configured', () => {
    expect(true).toBe(true)
  })

  it('should handle TypeScript', () => {
    const testValue: string = 'TypeScript is working'
    expect(typeof testValue).toBe('string')
    expect(testValue).toContain('TypeScript')
  })

  it('should have testing utilities available', () => {
    expect(render).toBeDefined()
  })

  it('should work with async/await', async () => {
    const asyncValue = await Promise.resolve('async works')
    expect(asyncValue).toBe('async works')
  })

  it('should render components without issues', () => {
    const { getByTestId } = render(<TestComponent />)
    const element = getByTestId('test-component')
    expect(element).toBeTruthy()
    expect(element.textContent).toBe('Hello, World!')
  })

  it('should handle DOM queries', () => {
    const { container } = render(<TestComponent />)
    const element = container.querySelector('[data-testid="test-component"]')
    expect(element).toBeTruthy()
  })
})

describe('Basic Component Rendering', () => {
  it('renders a simple component without crashing', () => {
    const { getByTestId } = render(<TestComponent />)

    // Check if the component renders
    const element = getByTestId('test-component')
    expect(element).toBeTruthy()
    expect(element.textContent).toBe('Hello, World!')
  })
})

// Placeholder test to demonstrate Jest is working
describe('Jest Configuration', () => {
  it('should be properly configured', () => {
    expect(true).toBe(true)
  })

  it('should handle TypeScript', () => {
    const testValue: string = 'TypeScript is working'
    expect(typeof testValue).toBe('string')
    expect(testValue).toContain('TypeScript')
  })

  it('should have testing utilities available', () => {
    expect(render).toBeDefined()
  })

  it('should work with async/await', async () => {
    const asyncValue = await Promise.resolve('async works')
    expect(asyncValue).toBe('async works')
  })
})
