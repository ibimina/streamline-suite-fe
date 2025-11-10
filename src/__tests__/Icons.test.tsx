/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'
import { ArrowUpIcon, ClockIcon } from '../components/Icons'

describe('Icon Components', () => {
  describe('ArrowUpIcon', () => {
    it('renders without crashing', () => {
      const { container } = render(<ArrowUpIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeTruthy()
    })

    it('has correct viewBox', () => {
      const { container } = render(<ArrowUpIcon />)
      const svg = container.querySelector('svg')
      expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24')
    })

    it('applies custom props', () => {
      const { container } = render(<ArrowUpIcon className='test-icon' data-testid='arrow-up' />)
      const svg = container.querySelector('svg')
      expect(svg?.classList.contains('test-icon')).toBe(true)
      expect(svg?.getAttribute('data-testid')).toBe('arrow-up')
    })

    it('has stroke properties', () => {
      const { container } = render(<ArrowUpIcon />)
      const svg = container.querySelector('svg')
      expect(svg?.getAttribute('stroke')).toBe('currentColor')
      expect(svg?.getAttribute('fill')).toBe('none')
    })
  })

  describe('ClockIcon', () => {
    it('renders without crashing', () => {
      const { container } = render(<ClockIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeTruthy()
    })

    it('has correct viewBox', () => {
      const { container } = render(<ClockIcon />)
      const svg = container.querySelector('svg')
      expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24')
    })

    it('applies custom styling', () => {
      const { container } = render(<ClockIcon style={{ width: '20px', height: '20px' }} />)
      const svg = container.querySelector('svg')
      expect(svg?.style.width).toBe('20px')
      expect(svg?.style.height).toBe('20px')
    })

    it('has proper SVG attributes', () => {
      const { container } = render(<ClockIcon />)
      const svg = container.querySelector('svg')
      expect(svg?.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg')
      expect(svg?.getAttribute('stroke')).toBe('currentColor')
    })
  })
})
