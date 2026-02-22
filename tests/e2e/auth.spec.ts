import { test, expect } from '@playwright/test'

test.describe('Authentication Smoke Tests', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login')

    // Check page loads correctly - match actual title
    await expect(page).toHaveTitle(/Streamline Suite.*Authentication/i)

    // Check for essential form elements
    await expect(page.locator('input[type="email"], input[name*="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"], input[name*="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible()
  })

  test('should load signup page', async ({ page }) => {
    await page.goto('/signup')

    // Check page loads correctly - match actual title
    await expect(page).toHaveTitle(/Streamline Suite.*Authentication/i)

    // Check for essential form elements
    await expect(page.locator('input[type="email"], input[name*="email"]')).toBeVisible()
    // Check for at least one password field (signup has password + confirm password)
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up|register|create/i })).toBeVisible()
  })

  test('should have navigation between auth pages', async ({ page }) => {
    await page.goto('/login')

    // Should have some way to get to signup - check if exists (might be hidden on mobile)
    const signupElements = page
      .locator('a, button, [role="button"]')
      .filter({ hasText: /sign up|register|create.*account/i })
    const signupCount = await signupElements.count()
    expect(signupCount).toBeGreaterThan(0)

    await page.goto('/signup')

    // Should have some way to get to login - check if exists (might be hidden on mobile)
    const loginElements = page
      .locator('a, button, [role="button"]')
      .filter({ hasText: /login|sign in|already.*account/i })
    const loginCount = await loginElements.count()
    expect(loginCount).toBeGreaterThan(0)
  })
})
