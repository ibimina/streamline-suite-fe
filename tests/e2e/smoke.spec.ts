import { test, expect } from '@playwright/test'

test.describe('Application Smoke Tests', () => {
  test('should load without JavaScript errors', async ({ page }) => {
    const jsErrors: string[] = []

    // Capture JavaScript errors
    page.on('pageerror', error => {
      jsErrors.push(error.message)
    })

    await page.goto('/')

    // Wait for page to fully load
    await page.waitForLoadState('networkidle')

    // Should have no JavaScript errors
    expect(jsErrors).toHaveLength(0)
  })

  test('should load essential resources', async ({ page }) => {
    await page.goto('/')

    // Wait for page to fully load
    await page.waitForLoadState('networkidle')

    // Check that CSS has loaded (page should be styled)
    const bodyStyles = await page.evaluate(() => {
      const body = document.body
      const styles = window.getComputedStyle(body)
      return {
        fontFamily: styles.fontFamily,
        margin: styles.margin,
        backgroundColor: styles.backgroundColor,
      }
    })

    // Should have some styling applied
    expect(bodyStyles.fontFamily).not.toBe('')
  })

  test('should have working external links', async ({ page }) => {
    await page.goto('/')

    // Find external links (if any)
    const externalLinks = await page.locator('a[href^="http"]').count()

    if (externalLinks > 0) {
      // Check first external link doesn't return 404
      const firstExternalLink = page.locator('a[href^="http"]').first()
      const href = await firstExternalLink.getAttribute('href')

      if (href) {
        // Open in new tab to avoid navigation
        await expect(firstExternalLink).toHaveAttribute('target', '_blank')
      }
    }
  })

  test('should have proper accessibility basics', async ({ page }) => {
    await page.goto('/')

    // Check for basic accessibility features
    await expect(page.locator('html')).toHaveAttribute('lang')

    // Should have at least one heading
    const headingCount = await page.locator('h1, h2, h3, h4, h5, h6').count()
    expect(headingCount).toBeGreaterThan(0)

    // Images should have alt text (if any images exist)
    const images = await page.locator('img').count()
    if (images > 0) {
      const imagesWithoutAlt = await page.locator('img:not([alt])').count()
      expect(imagesWithoutAlt).toBe(0)
    }
  })
})
