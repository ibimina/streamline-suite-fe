import { test, expect } from '@playwright/test'

test.describe('Critical Path Smoke Tests', () => {
  test('should handle 404 pages gracefully', async ({ page }) => {
    const response = await page.goto('/non-existent-page')

    // Should return 404 status
    expect(response?.status()).toBe(404)

    // Should display a proper 404 page (not blank) - check for any content
    await expect(page.locator('body')).not.toBeEmpty()
    // Should have some kind of content indicating 404
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()
  })

  test('should load public pages without errors', async ({ page }) => {
    const publicPages = ['/', '/about', '/features', '/pricing', '/contact-us']

    for (const path of publicPages) {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)

      // Page should have main content
      await expect(page.getByRole('main')).toBeVisible()
    }
  })

  test('should have proper meta tags for SEO', async ({ page }) => {
    await page.goto('/')

    // Check for essential meta tags
    await expect(page.locator('meta[name="description"]')).toHaveCount(1)
    await expect(page.locator('meta[name="viewport"]')).toHaveCount(1)

    // Title should exist and not be empty
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
  })

  test('should be responsive on mobile viewports', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Navigation should be mobile-friendly - use specific navigation
    await expect(page.getByRole('navigation', { name: 'Global' })).toBeVisible()

    // Content should be visible and not cut off
    await expect(page.getByRole('main')).toBeVisible()
  })
})
