import { test, expect } from '@playwright/test'

test.describe('Homepage Smoke Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Check if page loads without errors
    await expect(page).toHaveTitle(/Streamline Suite/i)

    // Check for essential elements - use specific navigation
    await expect(page.getByRole('navigation', { name: 'Global' })).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/')

    // Test navigation links exist in DOM (they might be hidden on mobile but should be present)
    // Check for links that navigate to the expected pages
    const aboutLink = page.locator('a[href="/about"], a[href*="about"]').first()
    const featuresLink = page.locator('a[href="/features"], a[href*="features"]').first()
    const pricingLink = page.locator('a[href="/pricing"], a[href*="pricing"]').first()
    const contactLink = page
      .locator('a[href="/contact-us"], a[href="/contact"], a[href*="contact"]')
      .first()

    // Verify links exist in DOM (even if hidden on mobile)
    await expect(aboutLink).toHaveCount(1)
    await expect(featuresLink).toHaveCount(1)
    await expect(pricingLink).toHaveCount(1)
    await expect(contactLink).toHaveCount(1)

    // Test that links have proper href attributes
    await expect(aboutLink).toHaveAttribute('href', /about/)
    await expect(featuresLink).toHaveAttribute('href', /features/)
    await expect(pricingLink).toHaveAttribute('href', /pricing/)
    await expect(contactLink).toHaveAttribute('href', /contact/)
  })

  test('should display branding elements', async ({ page }) => {
    await page.goto('/')

    // Check for any branding elements (multiple approaches)
    const h1Elements = page.locator('h1')
    const logoElements = page.locator('[class*="logo"], [class*="brand"], img[alt*="logo"]')
    const textElements = page.getByText('Streamline Suite')

    // At least one of these should be visible
    const h1Count = await h1Elements.count()
    const logoCount = await logoElements.count()
    const textCount = await textElements.count()

    expect(h1Count + logoCount + textCount).toBeGreaterThan(0)

    // If h1 exists, it should be visible
    if (h1Count > 0) {
      await expect(h1Elements.first()).toBeVisible()
    }
  })
})
