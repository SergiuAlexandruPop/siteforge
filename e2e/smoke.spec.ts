import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// Portfolio smoke E2E
// ---------------------------------------------------------------------------
// A production build of the portfolio client is started by playwright.config.ts.
// These tests assert the public surface renders and the core interaction (dark
// mode) works — not pixel-level detail. They catch the failures that unit tests
// can't: a broken build, a server-component crash, a 500 on a real route.
//
// Routes covered: home (/), blog (/blog), contact (/contact). Romanian is the
// default locale (no /en prefix), per the i18n convention.
// ---------------------------------------------------------------------------

test.describe('portfolio public pages render', () => {
  test('home page loads with header navigation', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.ok(), 'GET / should return 2xx').toBeTruthy()

    await expect(page.locator('header')).toBeVisible()
    await expect(
      page.getByRole('navigation', { name: 'Main navigation' }),
    ).toBeVisible()
  })

  test('blog index loads without error', async ({ page }) => {
    const response = await page.goto('/blog')
    expect(response?.ok(), 'GET /blog should return 2xx').toBeTruthy()
    await expect(page.locator('main')).toBeVisible()
  })

  test('contact page loads without error', async ({ page }) => {
    const response = await page.goto('/contact')
    expect(response?.ok(), 'GET /contact should return 2xx').toBeTruthy()
    await expect(page.locator('main')).toBeVisible()
  })
})

test.describe('dark mode toggle', () => {
  test('toggling theme flips the dark class on <html>', async ({ page }) => {
    await page.goto('/')

    const html = page.locator('html')
    // Server default theme is 'dark' (see ThemeToggle / anti-FOUC script).
    await expect(html).toHaveClass(/dark/)

    // The toggle's aria-label is Romanian and depends on current theme:
    // dark → "Comută la modul luminos" (switch to light).
    const toggle = page.getByRole('button', { name: /Comută la modul/ })
    await expect(toggle).toBeVisible()

    await toggle.click()
    await expect(html).not.toHaveClass(/dark/)

    await toggle.click()
    await expect(html).toHaveClass(/dark/)
  })
})
