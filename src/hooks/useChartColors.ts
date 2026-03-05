'use client'

import { useEffect, useState } from 'react'

interface ChartColors {
  primary: string
  secondary: string
  success: string
  warning: string
  destructive: string
  info: string
  muted: string
  accent: string
}

const defaultColors: ChartColors = {
  primary: '#2563eb',
  secondary: '#6366f1',
  success: '#16a34a',
  warning: '#f59e0b',
  destructive: '#dc2626',
  info: '#0ea5e9',
  muted: '#6b7280',
  accent: '#8b5cf6',
}

/**
 * Hook to get chart colors from CSS custom properties.
 * Automatically updates when theme changes (light/dark mode).
 */
export function useChartColors(): ChartColors {
  const [colors, setColors] = useState<ChartColors>(defaultColors)

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement
      const computedStyle = getComputedStyle(root)

      // Helper to get CSS variable value or fallback
      const getColor = (varName: string, fallback: string): string => {
        const value = computedStyle.getPropertyValue(varName).trim()
        // CSS variables might be in HSL format, convert if needed
        if (value.startsWith('hsl') || value.match(/^\d+\s+\d+%\s+\d+%$/)) {
          return `hsl(${value})`
        }
        return value || fallback
      }

      setColors({
        primary: getColor('--primary', defaultColors.primary),
        secondary: getColor('--secondary', defaultColors.secondary),
        success: getColor('--success', defaultColors.success),
        warning: getColor('--warning', defaultColors.warning),
        destructive: getColor('--destructive', defaultColors.destructive),
        info: getColor('--info', defaultColors.info),
        muted: getColor('--muted-foreground', defaultColors.muted),
        accent: getColor('--accent', defaultColors.accent),
      })
    }

    // Initial update
    updateColors()

    // Listen for theme changes via MutationObserver on the html element
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
          updateColors()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    })

    // Also listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateColors)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', updateColors)
    }
  }, [])

  return colors
}

/**
 * Returns an array of chart colors suitable for pie charts and bar charts.
 */
export function useChartColorArray(): string[] {
  const colors = useChartColors()
  return [
    colors.primary,
    colors.secondary,
    colors.success,
    colors.warning,
    colors.accent,
    colors.info,
  ]
}
