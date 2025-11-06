import { test, expect } from '@playwright/test'

test.describe('Homepage Smoke Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Check if page loads without errors
    await expect(page).toHaveTitle(/Streamline Suite/i)

    // Check for essential elements
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
  })

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/')

    // Test main navigation items exist
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /features/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /pricing/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible()
  })

  test('should display logo and branding', async ({ page }) => {
    await page.goto('/')

    // Check for logo/branding elements
    await expect(page.locator('[alt*="logo"], [alt*="Streamline"]')).toBeVisible()
  })
})
