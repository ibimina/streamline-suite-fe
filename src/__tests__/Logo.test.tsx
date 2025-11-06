/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'
import Logo from '../components/Logo'

// Mock Next.js modules
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

describe('Logo Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Logo />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
  })

  it('applies custom className', () => {
    const customClass = 'custom-logo-class'
    const { container } = render(<Logo className={customClass} />)
    const svg = container.querySelector('svg')
    expect(svg?.classList.contains(customClass)).toBe(true)
  })

  it('contains gradient elements', () => {
    const { container } = render(<Logo />)
    const gradient = container.querySelector('linearGradient')
    const stops = container.querySelectorAll('stop')

    expect(gradient).toBeTruthy()
    expect(stops.length).toBe(2)
  })

  it('has proper SVG structure', () => {
    const { container } = render(<Logo />)
    const svg = container.querySelector('svg')
    const path = container.querySelector('path')

    expect(svg).toBeTruthy()
    expect(path).toBeTruthy()
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24')
  })

  it('uses unique gradient ID', () => {
    const { container: container1 } = render(<Logo />)
    const { container: container2 } = render(<Logo />)

    const gradient1 = container1.querySelector('linearGradient')
    const gradient2 = container2.querySelector('linearGradient')

    const id1 = gradient1?.getAttribute('id')
    const id2 = gradient2?.getAttribute('id')

    // IDs should exist and be different (due to useId hook)
    expect(id1).toBeTruthy()
    expect(id2).toBeTruthy()
    expect(id1).not.toBe(id2)
  })
})
