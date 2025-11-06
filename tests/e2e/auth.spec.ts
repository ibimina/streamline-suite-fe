import { test, expect } from '@playwright/test'

test.describe('Authentication Smoke Tests', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login')

    // Check page loads correctly
    await expect(page).toHaveTitle(/Login|Sign In/i)

    // Check for essential form elements
    await expect(page.locator('input[type="email"], input[name*="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"], input[name*="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible()
  })

  test('should load signup page', async ({ page }) => {
    await page.goto('/signup')

    // Check page loads correctly
    await expect(page).toHaveTitle(/Sign Up|Register/i)

    // Check for essential form elements
    await expect(page.locator('input[type="email"], input[name*="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"], input[name*="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up|register/i })).toBeVisible()
  })

  test('should have link between login and signup', async ({ page }) => {
    await page.goto('/login')

    // Should have link to signup
    await expect(page.getByRole('link', { name: /sign up|register/i })).toBeVisible()

    await page.goto('/signup')

    // Should have link to login
    await expect(page.getByRole('link', { name: /login|sign in/i })).toBeVisible()
  })
})
